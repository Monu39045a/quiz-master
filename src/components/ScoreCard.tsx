import React, { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  total: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, total }) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate counting up the score
  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(score / 30); // smooth animation steps
    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setDisplayScore(current);
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  const percentage = (score / total) * 100;

  // Dynamic feedback message & color tone
  let message = "";
  let toneColor = "";

  if (percentage >= 90) {
    message = "Outstanding performance! 🏆";
    toneColor = "text-green-600";
  } else if (percentage >= 75) {
    message = "Great job! Keep it up 💪";
    toneColor = "text-emerald-600";
  } else if (percentage >= 50) {
    message = "Nice effort! You're getting there 👏";
    toneColor = "text-yellow-600";
  } else if (percentage >= 30) {
    message = "Keep practicing — progress takes time 📘";
    toneColor = "text-orange-600";
  } else {
    message = "Don’t give up! Every expert started small 🌱";
    toneColor = "text-red-600";
  }

  return (
    <div className="flex flex-col items-center mt-10 bg-gradient-to-br from-violet-100 to-indigo-50 rounded-2xl shadow-md p-8 w-full max-w-md mx-auto transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-violet-700 mb-3">
        Your Score
      </h2>

      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        <div
          className="absolute inset-0 rounded-full border-[10px] border-violet-200"
          style={{
            borderTopColor:
              percentage >= 80
                ? "#4ade80"
                : percentage >= 50
                ? "#facc15"
                : "#f87171",
            transform: `rotate(${(percentage / 100) * 360}deg)`,
            transition: "all 1s ease-in-out",
          }}
        />
        <span className="text-4xl font-bold text-indigo-700 z-10">
          {displayScore}
        </span>
        <span className="absolute text-gray-500 bottom-2 text-sm">
          / {total}
        </span>
      </div>

      <p className={`text-lg font-medium mt-2 ${toneColor}`}>{message}</p>
    </div>
  );
};

export default ScoreCard;
