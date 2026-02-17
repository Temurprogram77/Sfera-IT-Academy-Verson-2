import { apiClient } from "../lib/api/client";
import {
  IDashboardMetrics,
  IDashboardMetricsResponse,
  IScheduleRoom,
  IScheduleResponse,
  GroupEnum,
} from "../types/dashboard";

export const dashboardService = {
  // GET /dashboard — umumiy statistika
  getMetrics: async (): Promise<IDashboardMetrics | null> => {
    try {
      const response = await apiClient.get<IDashboardMetricsResponse>(
        "/dashboard"
      );
      if (response.data && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Dashboard metrics yuklashda xatolik:", error);
      return null;
    }
  },

  // GET /dashboard/schedule?groupEnum=JUFT_KUNLAR — jadval
  getSchedule: async (groupEnum: GroupEnum): Promise<IScheduleRoom[]> => {
    try {
      const response = await apiClient.get<IScheduleResponse>(
        `/dashboard/schedule?groupEnum=${groupEnum}`
      );
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error(`Jadval (${groupEnum}) yuklashda xatolik:`, error);
      return [];
    }
  },
};