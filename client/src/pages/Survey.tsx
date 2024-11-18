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
      className="min-h-screen p-8 transition-colors duration-300"
      style={scrollColorTransition(scrollProgress)}
    >
      {showConfetti && <Confetti />}
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8"
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
          Event Survey 🎉
        </motion.h1>
        <SurveyForm onComplete={handleComplete} />
      </motion.div>
    </div>
  );
}
