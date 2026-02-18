export interface User {
  id: number;
  fullName?: string;
  phone?: string;
  role?: string;
  imgUrl?: string;
  groupName?: string;
  parentName?: string;
  groupId?: number;
  teacherName?: string;
  roomName?: string;
  lessonCount?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;
}

export interface UpdatePasswordRequest {
  phone: string;
  password: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
  data?: any;
}