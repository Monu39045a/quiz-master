import {
  Bar,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const BarGraph = ({ title, data }: { title: string; data: any[] }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-8">
    <h2 className="text-xl font-semibold mb-4 text-violet-700">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Participants" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
