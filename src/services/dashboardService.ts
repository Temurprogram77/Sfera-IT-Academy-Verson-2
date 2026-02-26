import { apiClient } from "../lib/api/client";
import {
  IDashboardMetrics,
  IDashboardMetricsResponse,
  IScheduleRoom,
  IScheduleResponse,
  GroupEnum,
  IDashboardMetricsTeacher,
} from "../types/dashboard";

const getDashboardEndpoint = (): string => {
  const role = localStorage.getItem("user_role");
  return role === "ROLE_TEACHER" ? "/dashboard/teacher" : "/dashboard";
};

export const dashboardService = {
  // GET /dashboard or /dashboard/teacher — umumiy statistika
  getMetrics: async (): Promise<IDashboardMetrics | IDashboardMetricsTeacher | null> => {
    try {
      const endpoint = getDashboardEndpoint();
      const response = await apiClient.get<IDashboardMetricsResponse>(endpoint);
      if (response.data) {
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