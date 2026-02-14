import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieDataPoint } from "../../types/room";
import { CHART_COLORS } from "../../constants/statistics";

interface RatioPieChartProps {
  data: PieDataPoint[];
}

export const RatioPieChart = ({ data }: RatioPieChartProps) => {
  const PIE_COLORS = [CHART_COLORS.busy, CHART_COLORS.free];

  return (
    <Card title="Umumiy Nisbat">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};