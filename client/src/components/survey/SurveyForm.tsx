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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SurveyFormProps {
  onComplete: () => void;
}

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const { toast } = useToast();
  const form = useForm<Survey>({
    resolver: zodResolver(insertSurveySchema),
    defaultValues: {
      email: "",
      budget: 0,
      location: "",
      eventType: "",
      venue: "",
      date: "",
      preferences: "",
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
        title: "Success!",
        description: "Your survey has been submitted.",
      });
      onComplete();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Add all other form fields similarly */}
          
          <Button type="submit" className="w-full mt-6">
            Submit Survey 🎈
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
