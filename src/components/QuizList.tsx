// src/components/quizzes/QuizList.tsx
import QuizCard from "./QuizCard";

interface Quiz {
  id: number;
  title: string;
  scheduled_time: string;
  num_questions: number;
  duration_minutes: number;
}

interface QuizListProps {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
}

const QuizList = ({ quizzes, loading, error }: QuizListProps) => {
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!quizzes.length)
    return (
      <p className="text-center text-gray-600 mt-8">
        No quizzes found. Create your first quiz!
      </p>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} {...quiz} />
      ))}
    </div>
  );
};

export default QuizList;
