import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { Confetti } from "@/components/animations/Confetti";
import { scrollColorTransition, scrollFadeIn } from "@/lib/animations";

export default function Survey() {
  const [showConfetti, setShowConfetti] = useState(false);
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

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 animate-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-300/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-20">
        {showConfetti && <Confetti />}
        <motion.div 
          className="glass-card rounded-2xl shadow-xl p-8"
          variants={scrollFadeIn}
          initial="initial"
          animate="animate"
          custom={scrollProgress}
        >
          <motion.h1 
            className="text-4xl font-bold text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            SJTU Reunion Survey 🎉
          </motion.h1>
          <SurveyForm onComplete={handleComplete} />
        </motion.div>
      </div>
    </div>
  );
}
