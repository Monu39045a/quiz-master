// src/components/quizzes/CreateQuizModal.tsx
import { useState } from "react";

interface CreateQuizModalProps {
  onClose: () => void;
  onCreateSuccess: (newQuiz: any) => void;
  trainerId: string;
}

const CreateQuizModal = ({
  onClose,
  onCreateSuccess,
  trainerId,
}: CreateQuizModalProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [numQuestions, setNumQuestions] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Please upload a file");
    if (!startTime || !endTime)
      return alert("Please provide both start and end time");

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start < now) return alert("Start time cannot be in the past");
    if (end <= start) return alert("End time must be after the start time");
    if (numQuestions <= 0)
      return alert("Number of questions must be greater than zero");
    if (duration <= 0) return alert("Duration must be greater than zero");

    setLoading(true);

    console.log("numQuestions:", numQuestions, typeof numQuestions);
    console.log("duration:", duration, typeof duration);
    console.log("trainerId:", trainerId, typeof trainerId);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("start_time", startTime);
      formData.append("end_time", endTime);
      formData.append("num_questions", String(numQuestions));
      formData.append("duration_minutes", String(duration));
      formData.append("trainer_id", trainerId);
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/quiz/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to create quiz");

      onCreateSuccess({
        id: data.quiz_id,
        title,
        start_time: startTime,
        end_time: endTime,
        num_questions: numQuestions,
        duration_minutes: duration,
      });

      onClose();
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Create New Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quiz Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Start / End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                min={new Date().toISOString().slice(0, 16)} // prevent backdate
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                min={startTime || new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          {/* Number of Questions & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                min={1}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                placeholder="10"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="Enter duration in minutes"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Quiz File (.xlsx or .csv)
            </label>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;
