import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../types/common";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { BarGraph } from "../components/BarGtaph";
import { PieGraph } from "../components/PieGraph";

interface ScoreVsTime {
  participant_id: string;
  score: number;
  time_taken: number;
}

interface ResultsData {
  quiz_id: number;
  quiz_title: string;
  num_participants: number;
  num_questions: number;
  average_score: number;
  average_time_seconds: number;
  fastest_time_seconds: number;
  slowest_time_seconds: number;
  score_distribution: Record<string, number>;
  percentage_distribution: Record<string, number>;
  score_vs_time: ScoreVsTime[];
}

/* ✅ Small Reusable Components */
const StatsCard = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="bg-indigo-50 p-4 rounded-xl text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

const ResultsPage: React.FC = () => {
  const { quizId } = useParams();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/analytics/quiz/${quizId}/analysis`
        );
        if (!res.ok) throw new Error("Failed to fetch quiz results");
        setData(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading results...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">
        ⚠️ {error}
      </div>
    );
  if (!data)
    return (
      <div className="text-center mt-10 text-gray-600">
        No results available.
      </div>
    );

  const scoreDist = Object.entries(data.score_distribution).map(
    ([range, count]) => ({ range, count })
  );
  const percentDist = Object.entries(data.percentage_distribution).map(
    ([range, count]) => ({ name: range, value: count })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-violet-700 text-center mb-8">
          Quiz Analysis: {data.quiz_title}
        </h1>

        {/* ✅ Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Participants" value={data.num_participants} />
          <StatsCard
            label="Average Score"
            value={`${data.average_score.toFixed(1)} / ${data.num_questions}`}
          />
          <StatsCard
            label="Average Time (s)"
            value={data.average_time_seconds.toFixed(1)}
          />
          <StatsCard
            label="Time Range (s)"
            value={`${data.fastest_time_seconds} - ${data.slowest_time_seconds}`}
          />
        </div>

        {/* ✅ Charts */}
        <BarGraph title="Score Distribution" data={scoreDist} />
        <PieGraph title="Percentage Distribution" data={percentDist} />

        {/* ✅ Line Graph */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-violet-700">
            Score vs Time Taken
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.score_vs_time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="participant_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                name="Score"
              />
              <Line
                type="monotone"
                dataKey="time_taken"
                stroke="#82ca9d"
                name="Time (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
