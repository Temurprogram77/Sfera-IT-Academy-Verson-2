// services/userService.ts

import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import { UserProfileResponse } from "../types/user";

class UserService {
  // Profilni olish (user/me)
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>(
        API_ENDPOINTS.USER.PROFILE
      );

      return response;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
