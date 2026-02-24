import { Dayjs } from "dayjs";

// ✅ AttendanceStatus shu yerda defined bo'ladi
export type AttendanceStatus = "KELDI" | "KELMADI" | "SABABLI" | "KECH_QOLDI";

// ✅ STATUS_CONFIG export qilindi
export const STATUS_CONFIG: Record<AttendanceStatus, { color: string; label: string }> = {
  KELDI: { color: "#52c41a", label: "Keldi" },
  KELMADI: { color: "#ff4d4f", label: "Kelmadi" },
  SABABLI: { color: "#faad14", label: "Sababli" },
  KECH_QOLDI: { color: "#1890ff", label: "Kech qoldi" },
};

// ✅ Attendance interface export qilindi (StudentList ishlatadi)
export interface Attendance {
  id: number;
  studentId: string;
  fullName: string;
  status: AttendanceStatus;
  date: string;
  notes?: string;
}

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