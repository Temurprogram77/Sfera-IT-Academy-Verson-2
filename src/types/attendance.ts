// types/attendance.ts

export type AttendanceStatus = "KELDI" | "KELMADI" | "SABABLI";

export interface AttendanceRecord {
  id?: number;
  studentId: number;
  fullName?: string;
  status: AttendanceStatus;
  description?: string | null;
  date: string; // YYYY-MM-DD
}

export interface CreateAttendanceDto {
  studentId: number;
  status: AttendanceStatus;
  description: string | null;
  date: string;
}

export interface AttendanceDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    fullName: string;
    studentId: number;
    status: AttendanceStatus;
    description: string | null;
    date: string;
  };
}

export interface DeleteAttendanceResponse {
  success: boolean;
  message: string;
  data: string | null;
}