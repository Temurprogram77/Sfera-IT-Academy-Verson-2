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
}

export interface TeachersResponse {
  success: boolean;
  message: string;
  data: Teacher[];
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

// Student inside teacher detail
export interface TeacherStudent {
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

// Group inside teacher detail
export interface TeacherGroup {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  teacherId: number;
  categoryId: number;
  roomId: number;
  roomName: string;
  teacherName: string;
  categoryName: string;
}

// Teacher detail main object
export interface TeacherDetail {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
  studentList: TeacherStudent[];
  groupList: TeacherGroup[];
}

// API response
export interface TeacherDetailResponse {
  success: boolean;
  message: string;
  data: TeacherDetail;
}

