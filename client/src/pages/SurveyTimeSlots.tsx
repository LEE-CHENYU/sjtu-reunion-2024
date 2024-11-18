import { useState } from "react";
import { motion } from "framer-motion";
import { TimeSlotSelection } from "@/components/survey/TimeSlotSelection";
import { Confetti } from "@/components/animations/Confetti";
import { scrollColorTransition, scrollFadeIn } from "@/lib/animations";

export default function SurveyTimeSlots() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div 
      className="min-h-screen p-8 pt-20 transition-colors duration-300"
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
          SJTU Reunion Survey 🎉
        </motion.h1>
        <TimeSlotSelection onComplete={handleComplete} />
      </motion.div>
    </div>
  );
}
