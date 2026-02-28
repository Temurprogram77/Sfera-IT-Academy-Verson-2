// types/assessment.ts

export type MarkCategoryStatus = "YASHIL" | "SARIQ" | "QIZIL";
export type MarkStatus = "KUNLIK_BAHO" | "IMTIHON_BAHO";

// ─── Assessment (Baho) entity ──────────────────────────────────
export interface Assessment {
  markId: number;
  studentId: number;
  studentName: string;
  imageUrl?: string | null;
  totalScore: number;
  activityScore: number;
  homeworkScore: number;
  markCategoryStatus: MarkCategoryStatus;
  markStatus: MarkStatus;
  markDate?: string | null;
}

// ─── Shared pagination wrapper ─────────────────────────────────
export interface PaginationData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

// ─── Guruh bo'yicha baholar (GET /mark/byGroup/:groupId) ───────
export interface AssessmentsByGroupParams
  extends Record<string, string | number | undefined> {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface AssessmentsByGroupResponse {
  success: boolean;
  message: string;
  data: PaginationData<Assessment>;
}

// ─── My Marks (GET /mark/myMarks) ─────────────────────────────
export interface MyMarksParams extends Record<string, string | number | undefined> {
  page?: number;
  size?: number;
}

export interface MyMarksResponse {
  success: boolean;
  message: string;
  data: PaginationData<Assessment>;
}

// ─── Create Assessment (POST /mark) ────────────────────────────
// markStatus === IMTIHON_BAHO => faqat totalScore, qolgani 0
// markStatus === KUNLIK_BAHO  => activityScore + homeworkScore, totalScore 0
export interface CreateAssessmentDto {
  studentId: number;
  homeworkScore: number;
  activityScore: number;
  totalScore: number;
  markStatus: MarkStatus;
  date: string; // YYYY-MM-DD
}

export interface CreateAssessmentResponse {
  success: boolean;
  message: string;
  data: Assessment | null;
}

// ─── Update Assessment (PUT /mark/update) ──────────────────────
export interface UpdateAssessmentDto {
  id: number;
  studentId: number;
  homeworkScore: number;
  activityScore: number;
  totalScore: number;
  markStatus: MarkStatus;
  date: string; // YYYY-MM-DD
}

export interface UpdateAssessmentResponse {
  success: boolean;
  message: string;
  data: Assessment | string;
}

// ─── Delete Assessment (DELETE /mark/:markId) ──────────────────
export interface DeleteAssessmentResponse {
  success: boolean;
  message: string;
  data: string;
}

// ─── Get by ID (GET /mark/:markId) ────────────────────────────
export interface AssessmentDetailResponse {
  success: boolean;
  message: string;
  data: Assessment;
}

// ─── Form values (modal ichida ishlatiladi) ────────────────────
export interface AssessmentFormValues {
  markStatus: MarkStatus;
  totalScore?: number;
  activityScore?: number;
  homeworkScore?: number;
  date: string;
}