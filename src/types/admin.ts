export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Admin {
  id: number;
  fullName: string;
  phone: string;
  role: string;
  imageUrl: string,
}

export interface AdminListParams extends Record<string, string | number | undefined> {
  name?: string;
  phone?: string;
  page?: number;
  size?: number;
}

export interface AdminListResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<Admin>;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
  data: Admin | null;
}

export interface CreateAdminDto {
  fullName: string;
  phone: string;
  password: string;
}

export interface UpdateAdminDto {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
}

// types/admin.ts
export interface Admin {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
  role: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
