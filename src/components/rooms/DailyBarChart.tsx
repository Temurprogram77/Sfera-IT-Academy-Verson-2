import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "../../types/room";
import { CHART_COLORS } from "../../constants/statistics";

interface DailyBarChartProps {
  data: ChartDataPoint[];
}

export const DailyBarChart = ({ data }: DailyBarChartProps) => {
  return (
    <Card title="Kunlik Band & Bo'sh">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="busy" fill={CHART_COLORS.busy} name="Band" />
          <Bar dataKey="free" fill={CHART_COLORS.free} name="Bo'sh" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};