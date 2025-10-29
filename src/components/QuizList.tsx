// src/components/quizzes/QuizList.tsx
import type { Quiz } from "../types/common";
import QuizCard from "./QuizCard";

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
    <>
      <div className="flex flex-col gap-4 w-full">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} {...quiz} />
        ))}
      </div>
    </>
  );
};

export default QuizList;
