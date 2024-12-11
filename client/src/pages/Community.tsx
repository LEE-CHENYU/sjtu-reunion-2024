import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreatePost } from "@/components/community/CreatePost";
import { PostList } from "@/components/community/PostList";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { fadeIn, scrollColorTransition, scrollFadeIn, parallaxEffect } from "@/lib/animations";

export default function Community() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(position / maxScroll, 1));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePostCreated = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 animate-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-300/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <motion.div
          variants={scrollFadeIn}
          initial="initial"
          animate="animate"
          custom={scrollProgress}
          className="max-w-4xl mx-auto glass-card rounded-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              className="text-4xl font-bold text-gray-800"
              style={parallaxEffect(scrollProgress)}
            >
              Reunion Community Board 🎪
            </motion.h1>
            <Link href="/">
              <Button variant="outline" className="glass hover:bg-white/20">
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
              <PostList scrollProgress={scrollProgress} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
