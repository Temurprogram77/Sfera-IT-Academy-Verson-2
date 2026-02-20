import { useState, useEffect, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";
import { AttendanceRecord } from "../types/type";
import { attendanceService } from "../services/attendanceService";
import { createSSE } from "../services/sseService";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// ─── SSE stream ──────────────────────────────────────────────────────────────

export const useAttendanceStream = (groupId: number | null) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!groupId) return;
    setAttendance([]);

    const sse = createSSE({
      url: `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.ATTENDANCE.STREAM(groupId)}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => setAttendance(data),
      onError: () => toast.error("SSE ulanishda xatolik"),
    });

    return () => sse.close();
  }, [groupId]);

  return attendance;
};

// ─── Days in month ────────────────────────────────────────────────────────────

export const useDaysInMonth = (year: number, month: number): Dayjs[] =>
  useMemo(() => {
    const start = dayjs(new Date(year, month, 1));
    const end = start.endOf("month");
    const days: Dayjs[] = [];
    let current = start;
    while (!current.isAfter(end, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }
    return days;
  }, [year, month]);

// ─── Send attendance ──────────────────────────────────────────────────────────

export const useSendAttendance = (groupId: number | null) => {
  const [loadingCell, setLoadingCell] = useState<string | null>(null);

  const sendAttendance = async (
    studentId: number,
    date: Dayjs,
    status: "KELDI" | "KELMADI" | "SABABLI",
    description?: string,
    onSuccess?: () => void
  ) => {
    if (!groupId) return;

    const cellKey = `${studentId}-${date.format("YYYY-MM-DD")}`;
    setLoadingCell(cellKey);

    try {
      await attendanceService.createAttendance(groupId, [
        {
          studentId,
          status,
          description: status === "KELDI" ? null : (description ?? null),
          date: date.format("YYYY-MM-DD"),
        },
      ]);
      toast.success("Davomat saqlandi");
      onSuccess?.();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoadingCell(null);
    }
  };

  return { loadingCell, sendAttendance };
};