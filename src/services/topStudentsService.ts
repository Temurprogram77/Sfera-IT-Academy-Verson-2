import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import { TopStudentsResponse } from "../types/topStudents";

class TopStudentsService {
  async getTopStudents(): Promise<TopStudentsResponse> {
    try {
      const response = await apiClient.get<TopStudentsResponse>(
        API_ENDPOINTS.DASHBOARD_ENDPOINTS.TOP_STUDENTS,
      );
      return response;
    } catch (error) {
      console.error("Get top students error:", error);
      throw error;
    }
  }
}

export const topStudentsService = new TopStudentsService();
