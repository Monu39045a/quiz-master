import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import CreateQuizModal from "../components/CreateQuizModal";
import QuizCard from "../components/QuizCard";
import Navbar from "../components/Navbar";
import { BASE_URL, type Quiz } from "../types/common";

const TrainerDashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user_id, role } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams({
          role: role!,
          trainer_id: user_id!,
        });

        const response = await fetch(
          `${BASE_URL}/quiz/all?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes (${response.status})`);
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (err: any) {
        console.error("Error fetching quizzes:", err);
        setError(err.message || "Something went wrong while loading quizzes.");
      } finally {
        setLoading(false);
      }
    };

    if (role && user_id) {
      fetchQuizzes();
    }
  }, [role, user_id]);

  const handleQuizCreated = (newQuiz: Quiz) => {
    // Add newly created quiz to list
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  if (role !== "trainer") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500">
          You must be logged in as a <strong>Trainer</strong> to access this
          page.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">QUIZZES</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Create Quiz
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 mt-20">
            <p>Loading quizzes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center text-red-500 mt-20">
            <p>{error}</p>
          </div>
        )}

        {/* Quizzes Section */}
        {!loading && !error && quizzes.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>No quizzes found. Click “Create Quiz” to add one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <CreateQuizModal
            onClose={() => setShowModal(false)}
            onCreateSuccess={handleQuizCreated}
            trainerId={user_id}
          />
        )}
      </div>
    </>
  );
};

export default TrainerDashboard;
