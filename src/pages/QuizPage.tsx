import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../types/common";

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: string[];
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const { user_id } = useSelector((state: RootState) => state.user);
  const { num_questions, trainer_id, duration_minutes, title, end_time } =
    useSelector((state: RootState) => state.quiz);

  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState<number>(0);
  const [attemptedOn, setAttemptedOn] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (end_time) {
      const current = new Date();
      const quizEnd = new Date(end_time);
      if (current > quizEnd) {
        setIsExpired(true);
      }
    }
  }, [end_time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (isExpired) return;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/quiz/${quizId}/questions/`);
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data);

        setTotalTimeInSeconds(duration_minutes * 60);
        setStartTime(Date.now());
        setAttemptedOn(new Date().toISOString());
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId, duration_minutes, isExpired]);

  useEffect(() => {
    if (loading || score !== null || totalTimeInSeconds === 0) return;

    const timer = setInterval(() => {
      setTotalTimeInSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, score, totalTimeInSeconds]);

  // Answer selection
  const handleOptionChange = (questionId: number, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Submit quiz answers
  const handleSubmit = async (auto = false) => {
    if (submitting || score !== null) return;

    setSubmitting(true);
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - (startTime || endTime)) / 1000);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([qid, selected]) => ({
          question_id: Number(qid),
          selected,
        })
      );

      const payload = {
        quiz_id: Number(quizId),
        participant_id: user_id,
        trainer_id: trainer_id || "UNKNOWN",
        quiz_title: title || "Untitled Quiz",
        num_of_questions: num_questions,
        time_taken_seconds: timeTaken,
        attempted_at: attemptedOn,
        options_qna: formattedAnswers,
      };

      const response = await fetch(`${BASE_URL}/results/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to submit quiz");
      }

      const data = await response.json();
      console.log("Result saved:", data);

      setScore(data.score);
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      alert(error.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isExpired) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">
          Quiz Time Over ⏰
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          The quiz has ended and can no longer be attempted.
        </p>
        <button
          onClick={() => navigate("/dashboard/participant")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-violet-700">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-violet-700">Quiz</h1>
        <div
          className={`text-lg font-medium ${
            totalTimeInSeconds < 60 ? "text-red-500" : "text-green-500"
          }`}
        >
          {score === null ? formatTime(totalTimeInSeconds) : "✅ Submitted!"}
        </div>
      </div>

      {score !== null ? (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold mb-3 text-violet-700">
            Your Score
          </h2>

          <div
            className={`inline-block px-6 py-3 rounded-2xl text-2xl font-semibold shadow-md
              ${
                score / questions.length >= 0.8
                  ? "bg-green-100 text-green-700"
                  : score / questions.length >= 0.5
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {score} / {questions.length}
          </div>

          <p className="mt-4 text-gray-600 text-lg">
            {score / questions.length >= 0.8
              ? "Excellent performance! 🏆"
              : score / questions.length >= 0.5
              ? "Good effort! Keep learning 💪"
              : "Don’t worry — every attempt is progress 🚀"}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/dashboard/participant")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-full transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="border rounded-2xl p-4 mb-6 shadow-sm bg-white"
            >
              <h2 className="font-medium text-lg mb-2">
                {index + 1}. {q.question_text}
              </h2>
              <div className="space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md border ${
                      answers[q.id] === option
                        ? "bg-violet-100 border-violet-400"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={() => handleOptionChange(q.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </>
      )}
    </div>
  );
};

export default QuizPage;
