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
  imgUrl: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
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
export interface CreateStudentDto {
  fullName: string;
  phone: string;
  imgUrl: string;
  password: string;
  groupId: number;
  parentPhone: string;
  parentName: string;
}

// POST /student/saveParent
export interface CreateParentDto {
  fullName: string;
  phone: string;
  password: string;
}

// PUT /student
export interface UpdateStudentDto {
  id: number;
  fullName: string;
  phone: string;
  imgUrl: string;
}