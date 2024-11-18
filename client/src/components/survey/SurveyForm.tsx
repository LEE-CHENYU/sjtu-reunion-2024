import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSurveySchema, type Survey } from "db/schema";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { z } from "zod";

const EVENT_TYPES = [
  { id: "networking", label: "Professional Networking" },
  { id: "startup", label: "Seeking Startup Partner(s)" },
  { id: "dating", label: "Seeking the Other Half" },
  { id: "career", label: "Career Development" },
  { id: "social", label: "Social Gathering" },
  { id: "entertainment", label: "Entertainment & Fun" }
] as const;

const VENUES = [
  { id: "restaurants", label: "Restaurants" },
  { id: "pubs", label: "Pubs" },
  { id: "clubs", label: "Clubs" },
  { id: "event_spaces", label: "Event Spaces" },
  { id: "airbnb", label: "Airbnb" }
] as const;

const CURRENT_STATUS = [
  { value: "masters", label: "Master's Candidate" },
  { value: "phd", label: "PhD Candidate" },
  { value: "working", label: "Working Professional" },
  { value: "startup", label: "Founding a Start Up" },
  { value: "enjoying", label: "Enjoying Life" }
] as const;

const ALCOHOL_PREFERENCES = [
  { id: "none", label: "No Alcohol" },
  { id: "beer_wine", label: "Beer & Wine" },
  { id: "full_bar", label: "Full Bar" },
  { id: "byob", label: "BYOB" }
] as const;

const TIME_OPTIONS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

type TimeSlot = {
  date: Date;
  times: string[];
};

interface SurveyFormProps {
  onComplete: () => void;
}

type EventType = typeof EVENT_TYPES[number]["id"];
type VenueType = typeof VENUES[number]["id"];

interface FormValues extends Omit<Survey, 'availability'> {
  availability: TimeSlot[];
}

// Define the time slot type
const timeSlotSchema = z.object({
  date: z.date(),
  times: z.array(z.string())
});

// Client-side schema that accepts array for availability
const clientSurveySchema = z.object({
  email: z.string().email("Invalid email address"),
  budget: z.number().min(30, "Budget must be at least $30").max(200, "Budget cannot exceed $200"),
  location: z.string().min(1, "Location is required"),
  transportation: z.string().optional(),
  needsCouchSurfing: z.boolean(),
  eventTypes: z.array(z.string()).min(1, "Select at least one event type"),
  venue: z.array(z.string()).min(1, "Select at least one venue"),
  academicStatus: z.string().min(1, "Academic status is required"),
  // Accept array for client-side validation
  availability: z.array(timeSlotSchema).min(1, "Select at least one time slot"),
  dietaryRestrictions: z.string().optional(),
  alcoholPreferences: z.string().min(1, "Alcohol preference is required"),
});

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(clientSurveySchema),
    defaultValues: {
      email: "",
      budget: 50,
      location: "",
      transportation: "",
      needsCouchSurfing: false,
      eventTypes: [],
      venue: [],
      academicStatus: "",
      availability: [], // Initialize as empty array
      dietaryRestrictions: "",
      alcoholPreferences: "none",
    },
  });

  const watchedValues = form.watch();
  console.log("Current form values:", watchedValues);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Format the data before submission
      const formattedData = {
        ...data,
        availability: data.availability.map(slot => ({
          ...slot,
          date: new Date(slot.date) // Ensure date is properly converted
        }))
      };

      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error("Survey submission failed");
      }

      toast({
        title: "Success! 🎉",
        description: "Your survey has been submitted.",
      });

      onComplete();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error 😕",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("Form errors:", form.formState.errors);

  const isNYCArea = (location: string) => {
    const nycKeywords = ['new york', 'nyc', 'brooklyn', 'queens', 'bronx', 'staten island'];
    return nycKeywords.some(keyword => 
      location.toLowerCase().includes(keyword)
    );
  };

  const location = form.watch('location');
  const requireTransportation = location && !isNYCArea(location);

  return (
    <Form {...form}>
      <form 
        onSubmit={(e) => {
          console.log("Form submit event triggered");
          form.handleSubmit(onSubmit)(e);
        }} 
        className="space-y-8"
        noValidate
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 bg-blue-50 p-6 rounded-lg shadow-lg"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget Field */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range ($30-$200)</FormLabel>
                <FormControl>
                  <Slider
                    min={30}
                    max={200}
                    step={10}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>Selected: ${field.value}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where are you coming from?</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter your current location
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transportation field - conditionally rendered */}
          {requireTransportation && (
            <FormField
              control={form.control}
              name="transportation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How will you get here?</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transportation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select your primary mode of transportation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Couch Surfing Field - Only show if not from New York */}
          {form.watch("location") && form.watch("location").toLowerCase() !== "new york" && (
            <FormField
              control={form.control}
              name="needsCouchSurfing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you need couch surfing?</FormLabel>
                  <FormControl>
                    <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-md">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <div className="space-y-1 leading-none">
                        <FormDescription>
                          Check this if you need accommodation assistance during the event
                        </FormDescription>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Event Types Field */}
          <FormField
            control={form.control}
            name="eventTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Interests</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {EVENT_TYPES.map((type) => (
                    <FormItem
                      key={type.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(type.id)}
                          onCheckedChange={(checked) => {
                            const current = field.value;
                            const updated = checked
                              ? [...current, type.id]
                              : current.filter((value) => value !== type.id);
                            field.onChange(updated);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {type.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rest of the form fields... */}
          {/* Venue Preferences Field */}
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Preferences</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {VENUES.map((venue) => (
                    <FormItem
                      key={venue.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(venue.id)}
                          onCheckedChange={(checked) => {
                            const current = field.value;
                            const updated = checked
                              ? [...current, venue.id]
                              : current.filter((value) => value !== venue.id);
                            field.onChange(updated);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {venue.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Current Status Field */}
          <FormField
            control={form.control}
            name="academicStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENT_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Slot Calendar */}
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Time Slot Preferences</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length > 0 ? (
                            <span>{field.value.length} time slots selected</span>
                          ) : (
                            <span>Select time slots</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="multiple"
                          selected={field.value?.map(slot => slot.date) || []}
                          onSelect={(dates) => {
                            if (!dates) return;
                            // Keep existing time selections for dates that are still selected
                            const existingSlots = field.value?.filter(slot =>
                              dates.some(d => format(d, 'yyyy-MM-dd') === format(slot.date, 'yyyy-MM-dd'))
                            ) || [];

                            // Add new dates without time selections
                            const newDates = dates.filter(date =>
                              !field.value?.some(slot => format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                            ) || [];

                            field.onChange([
                              ...existingSlots,
                              ...newDates.map(date => ({ date, times: [] }))
                            ]);
                          }}
                          disabled={(date) => {
                            const d = new Date(date);
                            return d < new Date('2024-12-01') || d > new Date('2025-01-15');
                          }}
                          className="rounded-md border"
                        />

                        <div className="max-h-[300px] overflow-y-auto">
                          {field.value?.map((slot, index) => (
                            <div key={format(slot.date, 'yyyy-MM-dd')} className="p-3 border-t">
                              <h4 className="font-medium mb-2">
                                {format(slot.date, 'EEEE, MMMM d, yyyy')}
                              </h4>
                              <div className="grid grid-cols-4 gap-2">
                                {TIME_OPTIONS.map((time) => (
                                  <label
                                    key={time}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      checked={slot.times.includes(time)}
                                      onCheckedChange={(checked) => {
                                        const newValue = [...(field.value || [])];
                                        if (checked) {
                                          newValue[index].times = [...slot.times, time];
                                        } else {
                                          newValue[index].times = slot.times.filter(t => t !== time);
                                        }
                                        field.onChange(newValue);
                                      }}
                                    />
                                    <span className="text-sm">{time}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormDescription>
                  Select dates between Dec 1, 2024 and Jan 15, 2025, then choose available times
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dietary Restrictions Field */}
          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary Restrictions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any dietary restrictions..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alcohol Preferences Field */}
          <FormField
            control={form.control}
            name="alcoholPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alcohol Preferences</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    {ALCOHOL_PREFERENCES.map((pref) => (
                      <FormItem
                        key={pref.id}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={pref.id} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {pref.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Add error display */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="text-red-500 text-sm p-4 bg-red-50 rounded-md">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc pl-5 mt-2">
                {Object.entries(form.formState.errors).map(([key, error]) => (
                  <li key={key}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => console.log("Submit button clicked")}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold">Debug Info:</h3>
            <pre className="text-xs mt-2">
              {JSON.stringify(watchedValues, null, 2)}
            </pre>
          </div>
        </motion.div>
      </form>
    </Form>
  );
}