/**
 * TypeScript interfaces for Attendance Management System
 */

export type AttendanceStatus = 'KELDI' | 'KELMADI' | 'KECHIKTI' | 'BUGUN_YOQ';

export interface Attendance {
  id: string;
  fullName: string;
  studentId: string;
  status: AttendanceStatus;
  date: string;
  notes?: string;
}

export interface Group {
  id: string;
  groupName: string;
  students: Attendance[];
}

export interface AttendanceGroup {
  id: string;
  groupName: string;
  students: Attendance[];
}

// Status badge configuration
export const STATUS_CONFIG: Record<AttendanceStatus, { color: string; label: string }> = {
  KELDI: { color: 'green', label: 'Keldi' },
  KELMADI: { color: 'red', label: 'Kelmadi' },
  KECHIKTI: { color: 'orange', label: 'Kechikti' },
  BUGUN_YOQ: { color: 'blue', label: 'Bugun yo\'q' },
};
