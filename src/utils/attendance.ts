import dayjs, { Dayjs } from "dayjs";
import { AttendanceRecord, AttendanceStatus } from "../types/type";

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Berilgan student va sananing statusini topadi */
export const getAttendanceStatus = (
  attendance: AttendanceRecord[],
  studentId: number,
  date: Dayjs
): AttendanceStatus | undefined =>
  attendance.find(
    (a) => a.studentId === studentId && dayjs(a.date).isSame(date, "day")
  )?.status;

// ─── Stats calculations ───────────────────────────────────────────────────────

/**
 * Bir o'quvchi uchun oylik davomat foizini hisoblaydi.
 * KELDI + SABABLI → hozir hisobda.
 */
export const calcStudentRate = (
  attendance: AttendanceRecord[],
  studentId: number,
  pastDays: Dayjs[]
): number => {
  if (pastDays.length === 0) return 0;
  const present = pastDays.filter((d) => {
    const st = getAttendanceStatus(attendance, studentId, d);
    return st === "KELDI" || st === "SABABLI";
  }).length;
  return Math.round((present / pastDays.length) * 100);
};

/**
 * Bugungi kun statistikasi.
 * Har bir studentId FAQAT bir marta hisoblanadi — dublikat yo'q.
 * kechikkan = SABABLI + KECHIKTI statusi bo'lganlar
 */
export const calcTodayStats = (
  attendance: AttendanceRecord[],
  studentIds: number[],
  today: Dayjs
) => {
  let keldi = 0;
  let kelmadi = 0;
  let kechikkan = 0;

  for (const id of studentIds) {
    const status = getAttendanceStatus(attendance, id, today);
    if (status === "KELDI") keldi++;
    else if (status === "KELMADI") kelmadi++;
    else if (status === "SABABLI" || status === "KECHIKTI") kechikkan++;
  }

  return { keldi, kelmadi, kechikkan, total: studentIds.length };
};

/**
 * Oy davomidagi umumiy statistika.
 */
export const calcMonthStats = (
  attendance: AttendanceRecord[],
  studentIds: number[],
  pastDays: Dayjs[]
) => {
  let totalKeldi = 0;
  let totalKelmadi = 0;
  let totalSababli = 0;

  for (const id of studentIds) {
    for (const d of pastDays) {
      const status = getAttendanceStatus(attendance, id, d);
      if (status === "KELDI") totalKeldi++;
      else if (status === "KELMADI") totalKelmadi++;
      else if (status === "SABABLI") totalSababli++;
    }
  }

  const possible = studentIds.length * pastDays.length;
  const rate =
    possible > 0
      ? Math.round(((totalKeldi + totalSababli) / possible) * 100)
      : 0;

  return { totalKeldi, totalKelmadi, totalSababli, rate };
};

// ─── Student helpers ──────────────────────────────────────────────────────────

export const getStudentName = (s: {
  fulName?: string;
  fullName?: string;
}): string => s.fulName || s.fullName || "";

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();