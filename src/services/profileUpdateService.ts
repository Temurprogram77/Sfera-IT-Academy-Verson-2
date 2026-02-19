import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";

type UserRole = "ROLE_STUDENT" | "ROLE_TEACHER" | "ROLE_ADMIN" | "ROLE_SUPER_ADMIN" | "ROLE_PARENT";

interface UpdateProfileRequest {
  id: number;
  fullName: string;
  phone: string;
  imageUrl?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: any;
}

function getUpdateEndpoint(role: UserRole | null, id: number): string {
  switch (role) {
    case "ROLE_STUDENT":
      return `${API_ENDPOINTS.STUDENT.UPDATE}/${id}`;
    case "ROLE_TEACHER":
      return `${API_ENDPOINTS.TEACHER.UPDATE}/${id}`;
    case "ROLE_ADMIN":
    case "ROLE_SUPER_ADMIN":
      return `${API_ENDPOINTS.ADMIN.UPDATE_ADMIN}/${id}`;
    case "ROLE_PARENT":
      return `${API_ENDPOINTS.PARENT.UPDATE}/${id}`;
    default:
      return `${API_ENDPOINTS.USER.PROFILE}`;
  }
}

export const profileUpdateService = {
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const role = localStorage.getItem("user_role") as UserRole | null;
    const endpoint = getUpdateEndpoint(role, data.id);

    try {
      const response = await apiClient.put<UpdateProfileResponse>(endpoint, data);
      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
};