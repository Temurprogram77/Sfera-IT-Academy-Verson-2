import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  GroupActionResponse,
  GroupAllResponse,
  GroupDaysParams,
  GroupDaysResponse,
  GroupDetailResponse,
  GroupListParams,
  GroupListResponse,
  CreateGroupDto,
  UpdateGroupDto,
} from "../types/group";

class GroupService {
  async getGroups(params?: GroupListParams): Promise<GroupListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.GROUP.LIST, params);
      const response = await apiClient.get<GroupListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get groups error:", error);
      throw error;
    }
  }

  async getAllGroups(): Promise<GroupAllResponse> {
    try {
      const response = await apiClient.get<GroupAllResponse>(
        API_ENDPOINTS.GROUP.ALL
      );
      return response;
    } catch (error) {
      console.error("Get all groups error:", error);
      throw error;
    }
  }

  async getGroupById(groupId: string | number): Promise<GroupDetailResponse> {
    try {
      const url = API_ENDPOINTS.GROUP.GET_BY_ID(groupId);
      const response = await apiClient.get<GroupDetailResponse>(url);
      return response;
    } catch (error) {
      console.error("Get group by ID error:", error);
      throw error;
    }
  }

  async getGroupDays(params: GroupDaysParams): Promise<GroupDaysResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.GROUP.GET_DAYS, params);
      const response = await apiClient.get<GroupDaysResponse>(url);
      return response;
    } catch (error) {
      console.error("Get group days error:", error);
      throw error;
    }
  }

  async createGroup(data: CreateGroupDto): Promise<GroupActionResponse> {
    try {
      const response = await apiClient.post<GroupActionResponse>(
        API_ENDPOINTS.GROUP.CREATE,
        data
      );
      return response;
    } catch (error) {
      console.error("Create group error:", error);
      throw error;
    }
  }

  async updateGroup(data: UpdateGroupDto): Promise<GroupActionResponse> {
    try {
      const response = await apiClient.put<GroupActionResponse>(
        API_ENDPOINTS.GROUP.UPDATE,
        data
      );
      return response;
    } catch (error) {
      console.error("Update group error:", error);
      throw error;
    }
  }

  async deleteGroup(groupId: string | number): Promise<GroupActionResponse> {
    try {
      const url = API_ENDPOINTS.GROUP.DELETE(groupId);
      const response = await apiClient.delete<GroupActionResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete group error:", error);
      throw error;
    }
  }
}

export const groupService = new GroupService();