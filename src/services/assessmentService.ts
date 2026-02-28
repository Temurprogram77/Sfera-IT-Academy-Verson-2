// services/assessmentService.ts

import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import type {
  AssessmentsByGroupParams,
  AssessmentsByGroupResponse,
  AssessmentDetailResponse,
  MyMarksParams,
  MyMarksResponse,
  CreateAssessmentDto,
  CreateAssessmentResponse,
  UpdateAssessmentDto,
  UpdateAssessmentResponse,
  DeleteAssessmentResponse,
} from "../types/assessment";

class AssessmentService {
  // GET /mark/byGroup/:groupId?page=0&size=10
  async getAssessmentsByGroup(
    groupId: number | string,
    params?: AssessmentsByGroupParams
  ): Promise<AssessmentsByGroupResponse> {
    try {
      const url = buildUrlWithParams(
        API_ENDPOINTS.MARK.BY_GROUP(groupId),
        params
      );
      return await apiClient.get<AssessmentsByGroupResponse>(url);
    } catch (error) {
      console.error("Get assessments by group error", error);
      throw error;
    }
  }

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

  // GET /mark/:markId
  async getAssessmentById(id: string | number): Promise<AssessmentDetailResponse> {
    try {
      return await apiClient.get<AssessmentDetailResponse>(
        API_ENDPOINTS.MARK.GET_BY_ID(id)
      );
    } catch (error) {
      console.error("Get assessment detail error", error);
      throw error;
    }
  }

  // POST /mark
  // IMTIHON_BAHO => totalScore filled, activityScore & homeworkScore = 0
  // KUNLIK_BAHO  => activityScore + homeworkScore filled, totalScore = 0
  async createAssessment(data: CreateAssessmentDto): Promise<CreateAssessmentResponse> {
    try {
      return await apiClient.post<CreateAssessmentResponse>(
        API_ENDPOINTS.MARK.CREATE,
        data
      );
    } catch (error) {
      console.error("Create assessment error", error);
      throw error;
    }
  }

  // PUT /mark/update
  async updateAssessment(data: UpdateAssessmentDto): Promise<UpdateAssessmentResponse> {
    try {
      return await apiClient.put<UpdateAssessmentResponse>(
        API_ENDPOINTS.MARK.UPDATE,
        data
      );
    } catch (error) {
      console.error("Update assessment error", error);
      throw error;
    }
  }

  // DELETE /mark/:markId
  async deleteAssessment(id: number): Promise<DeleteAssessmentResponse> {
    try {
      return await apiClient.delete<DeleteAssessmentResponse>(
        API_ENDPOINTS.MARK.DELETE(id)
      );
    } catch (error) {
      console.error("Delete assessment error", error);
      throw error;
    }
  }
}

export const assessmentService = new AssessmentService();