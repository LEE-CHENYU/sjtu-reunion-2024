import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fadeIn, staggerChildren, bounceHover } from "@/lib/animations";
import type { Post, Comment, Reaction } from "db/schema";

const EMOJI_REACTIONS = ["👍", "❤️", "🎉", "🎪", "🎭"];

export function PostList() {
  const { data: posts, mutate } = useSWR<Post[]>("/api/posts");
  const { toast } = useToast();
  const [activeComment, setActiveComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const addReaction = async (postId: number, emoji: string) => {
    try {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          emoji,
          authorId: `anon_${Math.random().toString(36).slice(2, 7)}`
        })
      });
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  };

  const addComment = async (postId: number) => {
    if (!commentText.trim()) return;
    
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: commentText,
          authorId: `anon_${Math.random().toString(36).slice(2, 7)}`
        })
      });
      setCommentText("");
      setActiveComment(null);
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  if (!posts) return <div>Loading...</div>;

  return (
    <motion.div
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={fadeIn}
            layout
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content}</p>

              <div className="flex gap-2 mb-4">
                {EMOJI_REACTIONS.map((emoji) => (
                  <motion.div
                    key={emoji}
                    variants={bounceHover}
                    whileHover="hover"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addReaction(post.id, emoji)}
                    >
                      {emoji}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                {activeComment === post.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => addComment(post.id)}
                      >
                        Post Comment
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveComment(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveComment(post.id)}
                  >
                    Add Comment 💭
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
