// types/mark.ts

export type MarkCategoryStatus = "YASHIL" | "SARIQ" | "QIZIL";
export type MarkStatus = "KUNLIK_BAHO" | "IMTIHON_BAHO";

// ─── Mark entity ───────────────────────────────────────────────
export interface Mark {
  markId: number;
  studentId: number;
  studentName: string;
  imageUrl?: string;
  totalScore: number;
  activityScore: number;
  homeworkScore: number;
  markCategoryStatus: MarkCategoryStatus;
  markStatus: MarkStatus;
  markDate?: string;
}

// ─── Shared pagination wrapper ─────────────────────────────────
export interface PaginationData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

// ─── My Marks (GET /mark/myMarks) ─────────────────────────────
export interface MyMarksParams
  extends Record<string, string | number | undefined> {
  page?: number;
  size?: number;
}

export interface MyMarksResponse {
  success: boolean;
  message: string;
  data: PaginationData<Mark>;
}

// ─── By Group (GET /mark/byGroup/:groupId) ────────────────────
export interface MarksByGroupParams
  extends Record<string, string | number | undefined> {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface MarksByGroupResponse {
  success: boolean;
  message: string;
  data: PaginationData<Mark>;
}

// ─── Get Mark by ID ────────────────────────────────────────────
export interface MarkDetailResponse {
  success: boolean;
  message: string;
  data: Mark;
}

// ─── Create Mark ───────────────────────────────────────────────
export interface CreateMarkDto {
  studentId: number;
  homeworkScore: number;
  activityScore: number;
  totalScore: number;
  markStatus: MarkStatus;
  date: string; // YYYY-MM-DD
}

export interface CreateMarkResponse {
  success: boolean;
  message: string;
  data: Mark | null;
}

// ─── Update Mark ───────────────────────────────────────────────
export interface UpdateMarkDto {
  id: number;
  studentId: number;
  homeworkScore: number;
  activityScore: number;
  totalScore: number;
  markStatus: MarkStatus;
  date: string; // YYYY-MM-DD
}

export interface UpdateMarkResponse {
  success: boolean;
  message: string;
  data: Mark | string;
}

// ─── Delete Mark ───────────────────────────────────────────────
export interface DeleteMarkResponse {
  success: boolean;
  message: string;
  data: string;
}