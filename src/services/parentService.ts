import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  ParentListResponse,
  ParentResponse,
  CreateParentDto,
  ParentActionResponse,
  UpdateParentDto,
  ParentListParams,
} from "../types/parent";

class ParentService {
  async getParents(params?: ParentListParams): Promise<ParentListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.PARENT.LIST, params);
      const response = await apiClient.get<ParentListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get Parents error:", error);
      throw error;
    }
  }

  async getParentById(ParentId: string | number): Promise<ParentResponse> {
    try {
      const url = API_ENDPOINTS.PARENT.GET_BY_ID(ParentId);
      const response = await apiClient.get<ParentResponse>(url);
      return response;
    } catch (error) {
      console.error("Get Parent by ID error:", error);
      throw error;
    }
  }

  async createParent(data: CreateParentDto): Promise<ParentActionResponse> {
    try {
      const response = await apiClient.post<ParentActionResponse>(
        API_ENDPOINTS.PARENT.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create Parent error:", error);
      throw error;
    }
  }

  async updateParent(data: UpdateParentDto): Promise<ParentActionResponse> {
    try {
      const response = await apiClient.put<ParentActionResponse>(
        API_ENDPOINTS.PARENT.UPDATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update Parent error:", error);
      throw error;
    }
  }

  async deleteParent(ParentId: string | number): Promise<ParentActionResponse> {
    try {
      const url = API_ENDPOINTS.PARENT.DELETE(ParentId);
      const response = await apiClient.delete<ParentActionResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete Parent error:", error);
      throw error;
    }
  }
}

export const parentService = new ParentService();
