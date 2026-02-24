// services/markService.ts

import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  MyMarksParams,
  MyMarksResponse,
  MarksByGroupParams,
  MarksByGroupResponse,
  MarkDetailResponse,
  CreateMarkDto,
  CreateMarkResponse,
  UpdateMarkDto,
  UpdateMarkResponse,
  DeleteMarkResponse,
} from "../types/mark";

class MarkService {
  // GET /mark/myMarks?page=0&size=10
  async getMyMarks(params?: MyMarksParams): Promise<MyMarksResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.MARK.MY_MARKS, params);
      return await apiClient.get<MyMarksResponse>(url);
    } catch (error) {
      console.error("Get my marks error", error);
      throw error;
    }
  }

  // GET /mark/byGroup/:groupId?keyword=&page=0&size=10  (admin only)
  async getMarksByGroup(
    groupId: number | string,
    params?: MarksByGroupParams
  ): Promise<MarksByGroupResponse> {
    try {
      const url = buildUrlWithParams(
        API_ENDPOINTS.MARK.BY_GROUP(groupId),
        params
      );
      return await apiClient.get<MarksByGroupResponse>(url);
    } catch (error) {
      console.error("Get marks by group error", error);
      throw error;
    }
  }

  // GET /mark/:markId
  async getMarkById(id: string | number): Promise<MarkDetailResponse> {
    try {
      return await apiClient.get<MarkDetailResponse>(
        API_ENDPOINTS.MARK.GET_BY_ID(id)
      );
    } catch (error) {
      console.error("Get mark detail error", error);
      throw error;
    }
  }

  // POST /mark
  async createMark(data: CreateMarkDto): Promise<CreateMarkResponse> {
    try {
      return await apiClient.post<CreateMarkResponse>(
        API_ENDPOINTS.MARK.CREATE,
        data
      );
    } catch (error) {
      console.error("Create mark error", error);
      throw error;
    }
  }

  // PUT /mark/update
  async updateMark(data: UpdateMarkDto): Promise<UpdateMarkResponse> {
    try {
      return await apiClient.put<UpdateMarkResponse>(
        API_ENDPOINTS.MARK.UPDATE,
        data
      );
    } catch (error) {
      console.error("Update mark error", error);
      throw error;
    }
  }

  // DELETE /mark/:markId
  async deleteMark(id: number): Promise<DeleteMarkResponse> {
    try {
      return await apiClient.delete<DeleteMarkResponse>(
        API_ENDPOINTS.MARK.DELETE(id)
      );
    } catch (error) {
      console.error("Delete mark error", error);
      throw error;
    }
  }
}

export const markService = new MarkService();