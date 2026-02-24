// hooks/useAttendance.ts

import { useState, useEffect, useCallback } from "react";
import { attendanceService } from "../services/attendanceService";
import { createSSE } from "../services/sseService";
import { AttendanceRecord, AttendanceStatus, CreateAttendanceDto } from "../types/attendance";
import { toast } from "sonner";

interface UseAttendanceOptions {
  groupId: number | string;
  baseUrl: string;
}

export const useAttendance = ({ groupId, baseUrl }: UseAttendanceOptions) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingCell, setLoadingCell] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // ─── SSE Stream ───────────────────────────────────────────────
  useEffect(() => {
    if (!groupId) return;

    const sse = createSSE<AttendanceRecord[]>({
      url: `${baseUrl}/attendance/stream/${groupId}`,
      eventName: "attendance",
      onMessage: (data) => {
        setAttendance(data);
        setConnected(true);
      },
      onError: () => setConnected(false),
    });

    return () => sse.close();
  }, [groupId, baseUrl]);

  // ─── Get status for a student on a date ───────────────────────
  const getRecord = useCallback(
    (studentId: number, date: string) =>
      attendance.find(
        (a) => a.studentId === studentId && a.date === date
      ),
    [attendance]
  );

  const getStatus = useCallback(
    (studentId: number, date: string): AttendanceStatus | undefined =>
      getRecord(studentId, date)?.status,
    [getRecord]
  );

  // ─── Send attendance ──────────────────────────────────────────
  const sendAttendance = useCallback(
    async (
      studentId: number,
      date: string,
      status: AttendanceStatus,
      description?: string | null
    ) => {
      const cellKey = `${studentId}-${date}`;
      setLoadingCell(cellKey);

      const dto: CreateAttendanceDto = {
        studentId,
        status,
        description: status === "KELDI" ? null : (description ?? null),
        date,
      };

      try {
        await attendanceService.createAttendance(groupId, [dto]);
        // SSE will auto-update attendance state
      } catch {
        toast.error("Davomat saqlashda xatolik yuz berdi");
      } finally {
        setLoadingCell(null);
      }
    },
    [groupId]
  );

  // ─── Delete attendance ────────────────────────────────────────
  const deleteAttendance = useCallback(
    async (attendanceId: number) => {
      try {
        await attendanceService.deleteAttendance(attendanceId);
        toast.success("Davomat o'chirildi");
        // SSE will auto-update
      } catch {
        toast.error("O'chirishda xatolik yuz berdi");
      }
    },
    []
  );

  return {
    attendance,
    loadingCell,
    connected,
    getStatus,
    getRecord,
    sendAttendance,
    deleteAttendance,
  };
};