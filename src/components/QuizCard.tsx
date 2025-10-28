// src/components/quizzes/QuizCard.tsx
interface QuizCardProps {
  title: string;
  start_time: string;
  num_questions: number;
  duration_minutes: number;
}

const QuizCard = ({
  title,
  start_time,
  num_questions,
  duration_minutes,
}: QuizCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600">
        Scheduled:{" "}
        {new Date(start_time).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      <p className="text-sm text-gray-600">Questions: {num_questions}</p>
      <p className="text-sm text-gray-600">Duration: {duration_minutes} min</p>
    </div>
  );
};

export default QuizCard;
