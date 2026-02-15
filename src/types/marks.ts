// types/mark.ts

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Mark {
  markId: number;
  studentId: number;
  studentName: string;
  totalScore: number;
  activityScore: number;
  homeworkScore: number;
  markCategoryStatus: MarkCategoryStatus;
  markStatus: MarkStatus;
}

export type MarkCategoryStatus =
  | "YASHIL"    // Green
  | "SARIQ"     // Yellow
  | "QIZIL";    // Red

export type MarkStatus =
  | "KUNLIK_BAHO"
  | "IMTIHON_BAHO"

export interface MarkListParams extends Record<string, string | number | undefined> {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface MarkListResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Mark[];
  };
}

export interface MarkResponse {
  success: boolean;
  message: string;
  data: Mark;
}

export interface MarkActionResponse {
  success: boolean;
  message: string;
  data: Mark | null;
}

export interface CreateMarkDto {
  studentId: number;
  totalScore: number;
  activityScore: number;
  homeworkScore: number;
  markCategoryStatus: MarkCategoryStatus;
  markStatus: MarkStatus;
}

export interface UpdateMarkDto {
  markId: number;
  studentId: number;
  totalScore: number;
  activityScore: number;
  homeworkScore: number;
  markCategoryStatus: MarkCategoryStatus;
  markStatus: MarkStatus;
}