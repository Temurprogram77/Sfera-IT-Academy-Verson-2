// services/markService.ts

import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  MarkActionResponse,
  MarkListParams,
  MarkListResponse,
  MarkResponse,
  CreateMarkDto,
  UpdateMarkDto,
} from "../types/marks";

class MarkService {
  async getMarks(params?: MarkListParams): Promise<MarkListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.MARK.LIST, params);
      console.log("🔍 Mark API URL:", url);
      console.log("🔍 Mark API Params:", params);
      const response = await apiClient.get<MarkListResponse>(url);
      console.log("✅ Mark API Raw Response:", response);
      return response;
    } catch (error) {
      console.error("❌ Get marks error:", error);
      throw error;
    }
  }

  async getMarkById(markId: string | number): Promise<MarkResponse> {
    try {
      const url = API_ENDPOINTS.MARK.GET_BY_ID(markId);
      const response = await apiClient.get<MarkResponse>(url);
      return response;
    } catch (error) {
      console.error("Get mark by ID error:", error);
      throw error;
    }
  }

  async createMark(data: CreateMarkDto): Promise<MarkActionResponse> {
    try {
      const response = await apiClient.post<MarkActionResponse>(
        API_ENDPOINTS.MARK.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create mark error:", error);
      throw error;
    }
  }

  async updateMark(data: UpdateMarkDto): Promise<MarkActionResponse> {
    try {
      const response = await apiClient.put<MarkActionResponse>(
        API_ENDPOINTS.MARK.UPDATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update mark error:", error);
      throw error;
    }
  }

  async deleteMark(markId: string | number): Promise<MarkActionResponse> {
    try {
      const url = API_ENDPOINTS.MARK.DELETE(markId);
      const response = await apiClient.delete<MarkActionResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete mark error:", error);
      throw error;
    }
  }
}

export const markService = new MarkService();