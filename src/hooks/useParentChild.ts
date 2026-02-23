import { useQuery } from "@tanstack/react-query";
import { parentChildService } from "../services/parentChildService";
import {
  MyChild,
  ChildStats,
  ChildMark,
  ChildAttendanceDay,
  MarkFilter,
  AttendanceFilter,
} from "../types/parent";

const PARENT_CHILD_KEYS = {
  MY_CHILDREN: ["parent", "my-children"] as const,
  STATS: (id: number | string) => ["parent", "stats", id] as const,
  MARKS: (id: number | string, filter: MarkFilter) =>
    ["parent", "marks", id, filter] as const,
  ATTENDANCE: (id: number | string, filter: AttendanceFilter) =>
    ["parent", "attendance", id, filter] as const,
};

// GET /parent/my-child
export const useMyChildren = () => {
  const { data, isLoading, error, refetch } = useQuery<MyChild[], Error>({
    queryKey: PARENT_CHILD_KEYS.MY_CHILDREN,
    queryFn: async () => {
      const res = await parentChildService.getMyChildren();
      // { success, message, data: [...] } strukturasi
      return res.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  return { children: data ?? [], loading: isLoading, error, refetch };
};

// GET /parent/{studentId}/stats
export const useChildStats = (studentId: number | string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery<ChildStats, Error>({
    queryKey: PARENT_CHILD_KEYS.STATS(studentId!),
    queryFn: async () => {
      const res = await parentChildService.getChildStats(studentId!);
      return res.data;
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 2,
  });

  return {
    stats: data ?? { attendancePercent: null, averageGrade: 0, subjectsCount: 0 },
    loading: isLoading,
    error,
    refetch,
  };
};

// GET /parent/{studentId}/marks?filter=WEEKLY|MONTHLY
export const useChildMarks = (
  studentId: number | string | undefined,
  filter: MarkFilter = "WEEKLY"
) => {
  const { data, isLoading, error, refetch } = useQuery<ChildMark[], Error>({
    queryKey: PARENT_CHILD_KEYS.MARKS(studentId!, filter),
    queryFn: async () => {
      const res = await parentChildService.getChildMarks(studentId!, filter);
      return res.data ?? [];
    },
    enabled: !!studentId,
    staleTime: 0,
  });

  return { marks: data ?? [], loading: isLoading, error, refetch };
};

// GET /parent/{studentId}/attendance?filter=WEEKLY|MONTHLY
export const useChildAttendance = (
  studentId: number | string | undefined,
  filter: AttendanceFilter = "WEEKLY"
) => {
  const { data, isLoading, error, refetch } = useQuery<ChildAttendanceDay[], Error>({
    queryKey: PARENT_CHILD_KEYS.ATTENDANCE(studentId!, filter),
    queryFn: async () => {
      const res = await parentChildService.getChildAttendance(studentId!, filter);
      return res.data ?? [];
    },
    enabled: !!studentId,
    staleTime: 0,
  });

  return { attendance: data ?? [], loading: isLoading, error, refetch };
};