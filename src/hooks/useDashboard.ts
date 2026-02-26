import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { GroupEnum, IDashboardMetrics, IScheduleRoom, IDashboardMetricsTeacher } from "../types/dashboard";

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Bu qatorlarni QUERY_KEYS dagi EVENTS dan keyin qo'shing:
//
//  DASHBOARD: {
//    METRICS:  ["dashboard", "metrics"] as const,
//    SCHEDULE: (groupEnum: string) => ["dashboard", "schedule", groupEnum] as const,
//  },

// ─── Dashboard Metrics Hook ───────────────────────────────────────────────────
export const useDashboardMetrics = () => {
  const { data, isLoading, error, refetch } = useQuery<
    IDashboardMetrics | IDashboardMetricsTeacher | null,
    Error
  >({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 60_000, // 1 daqiqa
  });

  return {
    metrics: data ?? null,
    loading: isLoading,
    error,
    refetch,
  };
};

// ─── Schedule Hook ────────────────────────────────────────────────────────────
export const useSchedule = (groupEnum: GroupEnum) => {
  const { data, isLoading, error, refetch } = useQuery<IScheduleRoom[], Error>({
    queryKey: ["dashboard", "schedule", groupEnum],
    queryFn: () => dashboardService.getSchedule(groupEnum),
    staleTime: 60_000,
  });

  return {
    rooms: data ?? [],
    loading: isLoading,
    error,
    refetch,
  };
};