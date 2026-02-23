// ─── Mavjud Parent types (o'zgarishsiz) ───────────────────────────────────────
export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Parent {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
  role: string;
}

export interface ParentListParams extends Record<string, string | number | undefined> {
  name?: string;
  phone?: string;
  page?: number;
  size?: number;
}

export interface ParentListResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<Parent>;
}

export interface ParentResponse {
  success: boolean;
  message: string;
  data: Parent;
}

export interface ParentActionResponse {
  success: boolean;
  message: string;
  data: Parent | null;
}

export interface CreateParentDto {
  fullName: string;
  phone: string;
  imageUrl?: string;
  password: string;
}

export interface UpdateParentDto {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Yangi: My Child types ────────────────────────────────────────────────────

export type MarkFilter = "WEEKLY" | "MONTHLY";
export type AttendanceFilter = "WEEKLY" | "MONTHLY";

// GET /parent/my-child
export interface MyChild {
  id: number;
  fulName: string;       // backend "fulName" deb qaytaradi (typo backendda)
  imgUrl: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
  parentId: number;
  parentName: string;
  parentPhone: string;
}

export interface MyChildListResponse {
  success: boolean;
  message: string;
  data: MyChild[];
}

// GET /parent/{studentId}/stats
export interface ChildStats {
  attendancePercent: number | null;
  averageGrade: number;
  subjectsCount: number;
}

export interface ChildStatsResponse {
  success: boolean;
  message: string;
  data: ChildStats;
}

// GET /parent/{studentId}/marks?filter=WEEKLY|MONTHLY
export type MarkCategory = "YASHIL" | "SARIQ" | "QIZIL";

export interface ChildMark {
  day: string;
  score: number;
  category: MarkCategory;
  date: string;
}

export interface ChildMarksResponse {
  success: boolean;
  message: string;
  data: ChildMark[];
}

// GET /parent/{studentId}/attendance?filter=WEEKLY|MONTHLY
export interface ChildAttendanceDay {
  day: string;
  present: boolean;
}

export interface ChildAttendanceResponse {
  success: boolean;
  message: string;
  data: ChildAttendanceDay[];
}