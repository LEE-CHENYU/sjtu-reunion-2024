import React from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Survey } from "db/schema";

const TIME_OPTIONS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

type TimeSlot = {
  date: Date;
  times: string[];
};

interface TimeSlotSelectionProps {
  onComplete: () => void;
}

export function TimeSlotSelection({ onComplete }: TimeSlotSelectionProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<{ availability: TimeSlot[] }>({
    defaultValues: {
      availability: [],
    },
  });

  const onSubmit = async (data: { availability: TimeSlot[] }) => {
    try {
      // Get the main form data from localStorage
      const mainFormData = JSON.parse(localStorage.getItem("surveyFormData") || "{}");
      
      // Combine the data
      const surveyData: Survey = {
        ...mainFormData,
        availability: JSON.stringify(data.availability),
      };

      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) throw new Error("Survey submission failed");

      // Clear localStorage after successful submission
      localStorage.removeItem("surveyFormData");

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

  const handleBack = () => {
    setLocation('/survey');
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Time Slot Selection</h2>
              <p className="text-gray-600">Step 2 of 2</p>
            </div>
            <Button variant="outline" onClick={handleBack}>
              ← Back to Survey
            </Button>
          </div>

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

          <Button type="submit" className="w-full">
            Submit Survey
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
