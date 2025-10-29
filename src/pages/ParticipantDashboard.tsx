import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import React, { useEffect } from "react";
import type { RootState } from "../redux/store";
import { BASE_URL } from "../types/common";
import { useNavigate } from "react-router-dom";
import { setQuizDetails } from "../redux/quizSlice"; // ✅ import your action

interface Quiz {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  num_questions: number;
  duration_minutes: number;
  status: string;
  trainer_id?: string;
}

const ParticipantDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
  const { name, role, user_id } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch available quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/quiz/all?role=${role}&trainer_id=${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.statusText}`);
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes ", error);
      }
    };

    fetchQuizzes();
  }, [role, user_id]);

  // ✅ When user clicks "Take Quiz"
  const handleTakeQuiz = (quiz: Quiz) => {
    const quizData = {
      id: quiz.id,
      title: quiz.title,
      start_time: quiz.start_time,
      end_time: quiz.end_time,
      num_questions: quiz.num_questions,
      duration_minutes: quiz.duration_minutes,
      status: quiz.status,
      trainer_id: quiz.trainer_id || "UNKNOWN",
    };

    // Save quiz info in Redux
    dispatch(setQuizDetails(quizData));

    // Navigate to the quiz page
    navigate(`/quiz/take/${quiz.id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-purple-100 flex-col items-center px-4 py-10 relative">
        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome, <span className="text-indigo-600">{name}</span>
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Here are your available quizzes.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto space-y-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-violet-700">
                  {quiz.title}
                </h3>
                <p className="text-gray-600">
                  Duration: {quiz.duration_minutes} minutes
                </p>
                <p className="text-gray-600">
                  Start Time: {new Date(quiz.start_time).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  End Time: {new Date(quiz.end_time).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleTakeQuiz(quiz)} // ✅ Pass full quiz object
                className="bg-gradient-to-r from-indigo-500 to-violet-500 
                hover:from-violet-600 hover:to-indigo-600 
                text-white px-5 py-2 rounded-full text-sm font-medium 
                shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
              >
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
