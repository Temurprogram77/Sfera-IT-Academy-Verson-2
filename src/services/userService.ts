// services/userService.ts

import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";

import {
  UserProfileResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from "../types/user";

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

  async updatePassword(
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> {
    try {
      const response = await apiClient.put<UpdatePasswordResponse>(
        API_ENDPOINTS.USER.UPDATE_PASSWORD,
        data
      );

      return response;
    } catch (error) {
      console.error("Update password error:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
