import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "../../types/room";
import { CHART_COLORS } from "../../constants/statistics";

interface WeeklyTrendChartProps {
  data: ChartDataPoint[];
}

export const WeeklyTrendChart = ({ data }: WeeklyTrendChartProps) => {
  return (
    <Card title="Haftalik Trend">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="busy"
            stroke={CHART_COLORS.busy}
            name="Band"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="free"
            stroke={CHART_COLORS.free}
            name="Bo'sh"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};