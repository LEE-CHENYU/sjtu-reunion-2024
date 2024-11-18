import { useState } from "react";
import { motion } from "framer-motion";
import { CreatePost } from "@/components/community/CreatePost";
import { PostList } from "@/components/community/PostList";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { fadeIn } from "@/lib/animations";

export default function Community() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePostCreated = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Community Board 🎪</h1>
          <Link href="/">
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <CreatePost onPostCreated={handlePostCreated} />
          
          <motion.div
            animate={{ opacity: isRefreshing ? 0.5 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <PostList />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
