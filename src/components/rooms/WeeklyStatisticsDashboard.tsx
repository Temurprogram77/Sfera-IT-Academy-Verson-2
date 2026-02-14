"use client";

import { Card, Col, Empty, Row } from "antd";
import { WeeklyStat } from "../../types/room";
import {
  calculateTotalStats,
  preparePieData,
  transformWeeklyStatsToChartData,
} from "../../utils/statistics";
import { StatisticsCards } from "./StatisticsCards";
import { DailyBarChart } from "./DailyBarChart";
import { RatioPieChart } from "./RatioPieChart";
import { WeeklyTrendChart } from "./WeeklyTrendChart";
import { StatisticsHeader } from "./StatisticsHeader";

interface WeeklyStatisticsDashboardProps {
  weeklyStats: WeeklyStat[];
  title?: string;
  description?: string;
}

export default function WeeklyStatisticsDashboard({
  weeklyStats,
  title,
  description,
}: WeeklyStatisticsDashboardProps) {
  // Empty state
  if (!weeklyStats || weeklyStats.length === 0) {
    return (
      <Card>
        <Empty description="Statistika ma'lumotlari mavjud emas" />
      </Card>
    );
  }

  // Transform data
  const chartData = transformWeeklyStatsToChartData(weeklyStats);
  const { totalBusy, totalFree, totalHours, utilization } =
    calculateTotalStats(chartData);
  const pieData = preparePieData(totalBusy, totalFree);

  return (
    <div className="w-full space-y-6 p-4 md:p-8">
      <StatisticsHeader title={title} description={description} />

      <StatisticsCards
        totalBusy={totalBusy}
        totalFree={totalFree}
        totalHours={totalHours}
        utilization={utilization}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <DailyBarChart data={chartData} />
        </Col>

        <Col xs={24} lg={12}>
          <RatioPieChart data={pieData} />
        </Col>
      </Row>

      <WeeklyTrendChart data={chartData} />
    </div>
  );
}