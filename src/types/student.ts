// ============= PAGINATION =============
export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

// ============= STUDENT TYPE (from API GET) =============
// API qaytaradi: fulName, phoneNumber, imgUrl, groupId, groupName
export interface Student {
  id: number;
  fulName: string;
  phoneNumber: string;
  imgUrl: string; // API returns imgUrl (empty string if no image)
  groupId: number;
  groupName: string;
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
  data: Student;
}

export interface StudentActionResponse {
  success: boolean;
  message: string;
  data: Student | null;
}

// ============= DTOs (Request Bodies) =============

// POST /student/saveStudent
// API kutadi: fullName, phone, imgUrl, password, groupId, parentPhone, parentName
export interface CreateStudentDto {
  fullName: string;
  phone: string;
  imgUrl: string;
  password: string;
  groupId: number;
  parentPhone: string;
  parentName: string;
}

// PUT /student
// API kutadi: id, fullName, phone, imgUrl
export interface UpdateStudentDto {
  id: number;
  fullName: string;
  phone: string;
  imgUrl: string;
}