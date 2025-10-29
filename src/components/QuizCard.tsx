import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface QuizCardProps {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  num_questions: number;
  duration_minutes: number;
  status: string;
}

const QuizCard = ({
  id,
  title,
  start_time,
  end_time,
  num_questions,
  duration_minutes,
  status: initialStatus,
}: QuizCardProps) => {
  const [status, setStatus] = useState(initialStatus);
  const { role } = useSelector((state: RootState) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const startTime = new Date(start_time);
  const endTime = new Date(end_time);

  const handleStartQuiz = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/start/${id}`,
        { method: "PUT" }
      );
      if (res.ok) setStatus("started");
    } catch (err) {
      console.error("Error starting quiz:", err);
    }
  };

  const handleEndQuiz = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/end/${id}`,
        { method: "PUT" }
      );
      if (res.ok) setStatus("completed");
    } catch (err) {
      console.error("Error ending quiz:", err);
    }
  };

  let buttonText = "";
  let buttonColor = "";
  let buttonAction: (() => void) | null = null;
  const now = currentTime.getTime();

  if (status === "completed" || now >= endTime.getTime()) {
    buttonText = "Completed";
    buttonColor = "bg-gray-400 cursor-not-allowed";
  } else if (status === "started" && now < endTime.getTime()) {
    buttonText = "End Quiz";
    buttonColor = "bg-red-500 hover:bg-red-600";
    buttonAction = handleEndQuiz;
  } else if (now >= startTime.getTime() && status === "scheduled") {
    buttonText = role === "trainer" ? "Start Quiz" : "Not Started";
    buttonColor =
      role === "trainer"
        ? "bg-green-500 hover:bg-green-600"
        : "bg-yellow-400 cursor-not-allowed";
    if (role === "trainer") buttonAction = handleStartQuiz;
  } else {
    buttonText = "Scheduled";
    buttonColor = "bg-gray-300 text-gray-700 cursor-not-allowed";
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition">
      {/* Left Section: Quiz Info */}
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-sm text-gray-600">
          <strong>Start:</strong> {new Date(start_time).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          <strong>End:</strong> {new Date(end_time).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Questions: {num_questions} | Duration: {duration_minutes} min
        </p>
      </div>

      <div className="flex items-center gap-3">
        {(status === "completed" || now >= endTime.getTime()) && (
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
            View Results
          </button>
        )}
        <button
          onClick={buttonAction ?? undefined}
          disabled={!buttonAction}
          className={`px-4 py-2 text-white font-medium rounded-md transition ${buttonColor}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
