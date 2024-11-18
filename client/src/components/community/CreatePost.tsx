import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema, type Post } from "db/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fadeIn, bounceHover } from "@/lib/animations";
import { mutate } from "swr";

export function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Post>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: `anon_${Math.random().toString(36).slice(2, 7)}`,
      isModerated: false
    }
  });

  const onSubmit = async (data: Post) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Failed to create post");

      toast({
        title: "Success! 🎉",
        description: "Your post has been published.",
      });
      form.reset();
      mutate("/api/posts");
      onPostCreated();
    } catch (error) {
      toast({
        title: "Error 😕",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="bg-blue-50 rounded-xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a Post ✨</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="What's on your mind?" {...field} className="bg-white/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your thoughts..."
                    className="min-h-[100px] bg-white/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div variants={bounceHover} whileHover="hover">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post 🚀"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
