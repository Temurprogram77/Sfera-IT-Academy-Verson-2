import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import { GroupListResponse } from "../types/group";

class GroupService {
  // GET /group/all - Get all groups
  async getAllGroups(): Promise<GroupListResponse> {
    try {
      const response = await apiClient.get<GroupListResponse>(
        API_ENDPOINTS.GROUP.ALL
      );
      return response;
    } catch (error) {
      console.error("Get all groups error:", error);
      throw error;
    }
  }
}

export const groupService = new GroupService();