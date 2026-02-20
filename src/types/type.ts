

import { Dayjs } from "dayjs";
import { AttendanceStatus } from "../services/attendanceService";

export type { AttendanceStatus };

export interface AttendanceRecord {
  studentId: number;
  status: AttendanceStatus;
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
}

export interface SelectedCell {
  studentId: number;
  date: Dayjs;
  status: "KELMADI" | "SABABLI";
}