// services/markService.ts

import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  MyMarksParams,
  MyMarksResponse,
  MarkDetailResponse,
  CreateMarkDto,
  CreateMarkResponse,
  UpdateMarkDto,
  UpdateMarkResponse,
  DeleteMarkResponse,
} from "../types/mark";

class MarkService {
  // Mening baholarim — GET /mark/myMarks?page=0&size=10
  async getMyMarks(params?: MyMarksParams): Promise<MyMarksResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.MARK.MY_MARKS, params);
      const response = await apiClient.get<MyMarksResponse>(url);
      return response;
    } catch (error) {
      console.error("Get my marks error", error);
      throw error;
    }
  }

  // Barcha baholar — GET /mark?page=0&size=10
  async getMarks(params?: MyMarksParams): Promise<MyMarksResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.MARK.LIST, params);
      const response = await apiClient.get<MyMarksResponse>(url);
      return response;
    } catch (error) {
      console.error("Get marks error", error);
      throw error;
    }
  }

  // Bitta baho — GET /mark/:id
  async getMarkById(id: string | number): Promise<MarkDetailResponse> {
    try {
      const response = await apiClient.get<MarkDetailResponse>(
        API_ENDPOINTS.MARK.GET_BY_ID(id),
      );
      return response;
    } catch (error) {
      console.error("Get mark detail error", error);
      throw error;
    }
  }

  // Baho qo'shish — POST /mark
  async createMark(data: CreateMarkDto): Promise<CreateMarkResponse> {
    try {
      const response = await apiClient.post<CreateMarkResponse>(
        API_ENDPOINTS.MARK.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create mark error", error);
      throw error;
    }
  }

  // Baho yangilash — PUT /mark/update
  async updateMark(data: UpdateMarkDto): Promise<UpdateMarkResponse> {
    try {
      const response = await apiClient.put<UpdateMarkResponse>(
        API_ENDPOINTS.MARK.UPDATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update mark error", error);
      throw error;
    }
  }

  // Baho o'chirish — DELETE /mark/:id
  async deleteMark(id: number): Promise<DeleteMarkResponse> {
    try {
      const response = await apiClient.delete<DeleteMarkResponse>(
        API_ENDPOINTS.MARK.DELETE(id),
      );
      return response;
    } catch (error) {
      console.error("Delete mark error", error);
      throw error;
    }
  }
}

export const markService = new MarkService();