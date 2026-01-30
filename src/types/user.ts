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
