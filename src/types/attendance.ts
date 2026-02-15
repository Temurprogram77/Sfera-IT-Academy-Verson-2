/**
 * TypeScript interfaces for Attendance Management System
 */

// Talabaning davomat holatlari
export type AttendanceStatus = 'KELDI' | 'KELMADI' | 'KECHIKTI' | 'BUGUN_YOQ';

// Bir talabaning davomat ma'lumotlari
export interface Attendance {
  id: string;          // Unikal identifikator
  fullName: string;    // Talabaning to‘liq ismi
  studentId: string;   // Talabaning ID raqami
  status: AttendanceStatus;  // Davomat holati
  date: string;        // Sana (ISO formatida bo‘lishi ma’qul)
  notes?: string;      // Qo‘shimcha eslatmalar (ixtiyoriy)
}

// Guruh va uning talabalari
export interface Group {
  id: string;              // Guruh ID
  groupName: string;       // Guruh nomi
  students: Attendance[];  // Guruhdagi talabalarning davomat ro‘yxati
}

// Status badge konfiguratsiyasi (rang va label)
export const STATUS_CONFIG: Record<AttendanceStatus, { color: string; label: string }> = {
  KELDI: { color: 'green', label: 'Keldi' },
  KELMADI: { color: 'red', label: 'Kelmadi' },
  KECHIKTI: { color: 'orange', label: 'Kechikti' },
  BUGUN_YOQ: { color: 'blue', label: "Bugun yo'q" },
};