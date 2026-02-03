// Create Teacher
export interface CreateTeacherDto {
  fullName: string;
  phone: string;
  password: string;
}

export interface CreateTeacherResponse {
  success: boolean;
  message: string;
  data: null;
}

// Update Teacher
export interface UpdateTeacherDto {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
}

export interface UpdateTeacherResponse {
  success: boolean;
  message: string;
  data: string;
}

// Delete Teacher
export interface DeleteTeacherResponse {
  success: boolean;
  message: string;
  data: string;
}

// Get Teachers (List)
export interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherListParams extends Record<string, string | number | undefined> {
  name?: string;
  phone?: string;
  page?: number;
  size?: number;
}

export interface PaginationData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface TeacherListResponse {
  success: boolean;
  message: string;
  data: PaginationData<Teacher>;
}