// types/student.ts

// ============= PAGINATION =============
export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

// ============= STUDENT TYPE (from API GET) =============
export interface Student {
  id: number;
  fulName: string;
  phoneNumber: string;
  imgUrl: string;
  groupId: number;
  groupName: string;
  parentPhone: string;
}

// ============= STUDENT DETAIL TYPE (from API GET by ID) =============
export interface StudentDetail {
  id: number;
  fulName: string;
  imgUrl: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
  parentId: number;
  parentName: string;
  parentPhone: string;
}

export interface StudentListParams extends Record<string, string | number | undefined> {
  name?: string;
  phone?: string;
  page?: number;
  size?: number;
}

// ============= API RESPONSES =============
export interface StudentListResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<Student>;
}

export interface StudentResponse {
  success: boolean;
  message: string;
  data: StudentDetail; // Detail uchun StudentDetail ishlatamiz
}

export interface StudentActionResponse {
  success: boolean;
  message: string;
  data: Student | null;
}

// ============= DTOs (Request Bodies) =============
export interface CreateStudentDto {
  fullName: string;
  phone: string;
  imgUrl: string;
  password: string;
  groupId: number;
  parentPhone: string;
  parentName: string;
}

export interface UpdateStudentDto {
  id: number;
  fullName: string;
  phone: string;
  imgUrl: string;
  parentPhone: string;
}

// Guruhni o'zgartirish uchun
export interface UpdateStudentGroupDto {
  studentId: number;
  groupId: number;
}

// Password change uchun
export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}