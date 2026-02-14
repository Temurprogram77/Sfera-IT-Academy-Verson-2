import { TimeSlot, WeeklyStat, ChartDataPoint, PieDataPoint } from "../types/room";
import { DAY_NAME_MAP, HOURS_PER_DAY } from "../constants/statistics";

export const calculateHoursFromSlot = (slot: TimeSlot): number => {
  const startHour = parseInt(slot.start.split(":")[0]);
  const endHour = parseInt(slot.end.split(":")[0]);
  return endHour - startHour;
};
export const calculateBusyHours = (busySlots: TimeSlot[]): number => {
  return busySlots.reduce((total, slot) => {
    return total + calculateHoursFromSlot(slot);
  }, 0);
};

export const transformWeeklyStatsToChartData = (
  weeklyStats: WeeklyStat[]
): ChartDataPoint[] => {
  return weeklyStats.map((stat) => {
    const busyHours = calculateBusyHours(stat.busy);
    const freeHours = HOURS_PER_DAY - busyHours;

    return {
      name: DAY_NAME_MAP[stat.day] || stat.day,
      busy: busyHours,
      free: freeHours,
    };
  });
};

export const calculateTotalStats = (chartData: ChartDataPoint[]) => {
  const totalBusy = chartData.reduce((sum, day) => sum + day.busy, 0);
  const totalFree = chartData.reduce((sum, day) => sum + day.free, 0);
  const totalHours = totalBusy + totalFree;
  const utilization = totalHours === 0 ? 0 : (totalBusy / totalHours) * 100;

  return { totalBusy, totalFree, totalHours, utilization };
};

export const preparePieData = (
  totalBusy: number,
  totalFree: number
): PieDataPoint[] => {
  return [
    { name: "Band vaqtlar", value: totalBusy },
    { name: "Bo'sh vaqtlar", value: totalFree },
  ];
};