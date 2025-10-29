import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a29bfe"];

export const PieGraph = ({ title, data }: { title: string; data: any[] }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-8 flex flex-col items-center">
    <h2 className="text-xl font-semibold mb-4 text-violet-700">{title}</h2>
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          label={({ name, value }) => `${name} (${value})`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
