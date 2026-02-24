import { Dayjs } from "dayjs";

// ✅ attendanceService emas, attendance types dan import
export type { AttendanceStatus } from "./attendance";

export interface AttendanceRecord {
  studentId: number;
  status: string;
  description?: string | null;
  date: string;
}

export interface Student {
  id: number;
  fulName?: string;
  fullName?: string;
}

export interface Group {
  id: number;
  name: string;
  startTime?: string;
  endTime?: string;
  teacherName?: string;
  categoryName?: string;
  studentCount?: number;
}

export interface SelectedCell {
  studentId: number;
  date: Dayjs;
  status: "KELMADI" | "SABABLI";
}