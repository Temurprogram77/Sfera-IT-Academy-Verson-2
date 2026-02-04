export interface User {
  id: number;
  fullName: string;
  phone: string;
  role: string;
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

