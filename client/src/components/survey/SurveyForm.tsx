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
  specialInterests: string;
}

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(insertSurveySchema),
    defaultValues: {
      email: "",
      budget: 30,
      location: "",
      transportation: "",
      eventTypes: ["networking"] as EventType[],
      venue: ["restaurants"] as VenueType[],
      academicStatus: "masters",
      availability: [],
      dietaryRestrictions: "",
      alcoholPreferences: "none",
      specialInterests: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert the TimeSlot array to a JSON string for storage
      const surveyData: Survey = {
        ...data,
        availability: JSON.stringify(data.availability),
      };

      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) throw new Error("Survey submission failed");

      toast({
        title: "Success! 🎉",
        description: "Your survey has been submitted.",
      });
      onComplete();
      
      setTimeout(() => {
        setLocation('/dashboard');
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const location = form.watch("location");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input placeholder="Enter your location" {...field} />
                </FormControl>
                <FormDescription>This helps us plan commute arrangements</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transportation Field */}
          {location && location.toLowerCase() !== "new york" && (
            <FormField
              control={form.control}
              name="transportation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="plane">Plane</SelectItem>
                      <SelectItem value="driving">Driving</SelectItem>
                      <SelectItem value="rideshare">Ride-share</SelectItem>
                    </SelectContent>
                  </Select>
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
              <FormItem className="flex flex-col">
                <FormLabel>Time Slot Preferences</FormLabel>
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
                      selected={field.value.map(slot => slot.date)}
                      onSelect={(dates) => {
                        // Keep existing time selections for dates that are still selected
                        const existingSlots = field.value.filter(slot =>
                          dates?.some(d => format(d, 'yyyy-MM-dd') === format(slot.date, 'yyyy-MM-dd'))
                        );
                        
                        // Add new dates without time selections
                        const newDates = dates?.filter(date =>
                          !field.value.some(slot => format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
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
                      {field.value.map((slot, index) => (
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
                                    const newValue = [...field.value];
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
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {ALCOHOL_PREFERENCES.map((pref) => (
                      <FormItem
                        key={pref.id}
                        className="flex items-center space-x-3 space-y-0"
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
          
          {/* Special Interests Field */}
          <FormField
            control={form.control}
            name="specialInterests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Interests</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your special interests" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Submit Survey 🎈
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}