import { useState } from "react";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { Confetti } from "@/components/animations/Confetti";

export default function Survey() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      {showConfetti && <Confetti />}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Event Survey 🎉</h1>
        <SurveyForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
