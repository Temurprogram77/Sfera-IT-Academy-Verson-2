// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export interface IDashboardMetrics {
  countStudents: number;
  countRooms: number;
  countGroups: number;
  countCategory: number;
  countEmployees: number;
  countLessons: number;
}

export interface IDashboardMetricsResponse {
  success: boolean;
  message: string;
  data: IDashboardMetrics;
}

// ─── Schedule (Jadval) ────────────────────────────────────────────────────────
export type GroupEnum = "JUFT_KUNLAR" | "TOQ_KUNLAR" | "BOSHQA_KUNLAR";

export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface IScheduleGroup {
  groupName: string;
  teacherName: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  weekDays: WeekDay[];
}

export interface IScheduleRoom {
  roomName: string;
  groups: IScheduleGroup[];
}

export interface IScheduleResponse {
  success: boolean;
  message: string;
  data: IScheduleRoom[];
}