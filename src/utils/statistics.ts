import { TimeSlot, WeeklyStat, ChartDataPoint, PieDataPoint } from "../types/room";
import { DAY_NAME_MAP } from "../constants/statistics";

export const WORK_START_HOUR = 8;
export const WORK_END_HOUR = 20;
export const HOURS_PER_DAY = WORK_END_HOUR - WORK_START_HOUR;

const parseTimeToDecimal = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour + minute / 60;
};

export const calculateHoursFromSlot = (slot: TimeSlot): number => {
  const start = parseTimeToDecimal(slot.start);
  const end = parseTimeToDecimal(slot.end);

  const adjustedStart = Math.max(start, WORK_START_HOUR);
  const adjustedEnd = Math.min(end, WORK_END_HOUR);

  return Math.max(0, adjustedEnd - adjustedStart);
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
    if (stat.day.toLowerCase() === "sunday") {
      return {
        name: DAY_NAME_MAP[stat.day] || stat.day,
        busy: 0,
        free: HOURS_PER_DAY,
      };
    }

    const busyHours = calculateBusyHours(stat.busy);
    const freeHours = Math.max(0, HOURS_PER_DAY - busyHours);

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

export const isCurrentlyBusy = (busySlots: TimeSlot[]): boolean => {
  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;

  if (currentTime < WORK_START_HOUR || currentTime >= WORK_END_HOUR) {
    return false;
  }

  return busySlots.some((slot) => {
    const start = parseTimeToDecimal(slot.start);
    const end = parseTimeToDecimal(slot.end);

    return currentTime >= start && currentTime < end;
  });
};

export const getCurrentStatus = (busySlots: TimeSlot[]): "busy" | "free" => {
  return isCurrentlyBusy(busySlots) ? "busy" : "free";
};