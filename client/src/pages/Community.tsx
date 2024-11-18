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
    <div 
      className="min-h-screen p-8 pt-20 transition-colors duration-300"
      style={scrollColorTransition(scrollProgress)}
    >
      <motion.div
        variants={scrollFadeIn}
        initial="initial"
        animate="animate"
        custom={scrollProgress}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-4xl font-bold text-black"
            style={parallaxEffect(scrollProgress)}
          >
            Reunion Community Board 🎪
          </motion.h1>
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
            <PostList scrollProgress={scrollProgress} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
