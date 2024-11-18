import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSurveySchema, type Survey } from "db/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const EVENT_TYPES = [
  { id: "career", label: "Career" },
  { id: "academic", label: "Academic" },
  { id: "social", label: "Social" },
  { id: "dating", label: "Dating" },
  { id: "entertainment", label: "Entertainment" },
];

const VENUES = [
  { id: "restaurants", label: "Restaurants" },
  { id: "pubs", label: "Pubs" },
  { id: "clubs", label: "Clubs" },
  { id: "event_spaces", label: "Event Spaces" },
];

const ACADEMIC_STATUS = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "postdoc", label: "Post-doc" },
  { value: "faculty", label: "Faculty" },
  { value: "staff", label: "Staff" },
  { value: "alumni", label: "Alumni" },
  { value: "other", label: "Other" },
];

const ALCOHOL_PREFERENCES = [
  { id: "none", label: "No Alcohol" },
  { id: "beer_wine", label: "Beer & Wine" },
  { id: "full_bar", label: "Full Bar" },
  { id: "byob", label: "BYOB" },
];

interface SurveyFormProps {
  onComplete: () => void;
}

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<Survey>({
    resolver: zodResolver(insertSurveySchema),
    defaultValues: {
      email: "",
      budget: 0,
      location: "",
      transportation: "",
      eventTypes: [],
      venue: [],
      academicStatus: "undergraduate",
      availability: "",
      dietaryRestrictions: "",
      alcoholPreferences: "none",
    },
  });

  const onSubmit = async (data: Survey) => {
    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
                <FormLabel>Budget (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="10000"
                    placeholder="Enter your budget"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Maximum budget for the event</FormDescription>
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
                <FormLabel>Preferred Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter preferred location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transportation Field */}
          <FormField
            control={form.control}
            name="transportation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transportation Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public Transport</SelectItem>
                    <SelectItem value="private">Private Vehicle</SelectItem>
                    <SelectItem value="rideshare">Rideshare</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Event Types Field */}
          <FormField
            control={form.control}
            name="eventTypes"
            render={() => (
              <FormItem>
                <FormLabel>Event Types</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {EVENT_TYPES.map((type) => (
                    <FormField
                      key={type.id}
                      control={form.control}
                      name="eventTypes"
                      render={({ field }) => (
                        <FormItem
                          key={type.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
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
                      )}
                    />
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
            render={() => (
              <FormItem>
                <FormLabel>Venue Preferences</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {VENUES.map((venue) => (
                    <FormField
                      key={venue.id}
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem
                          key={venue.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(venue.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
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
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Academic Status Field */}
          <FormField
            control={form.control}
            name="academicStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ACADEMIC_STATUS.map((status) => (
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

          {/* Availability Field */}
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Availability</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
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