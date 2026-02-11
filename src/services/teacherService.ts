import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  CreateTeacherDto,
  CreateTeacherResponse,
  TeacherListParams,
  TeacherListResponse,
  UpdateTeacherDto,
  UpdateTeacherResponse,
  DeleteTeacherResponse,
} from "../types/teacher";

class TeacherService {
  async getTeachers(params?: TeacherListParams): Promise<TeacherListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.TEACHER.LIST, params);
      const response = await apiClient.get<TeacherListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get teachers error", error);
      throw error;
    }
  }

  // Yangi teacher qo'shish
  async createTeacher(data: CreateTeacherDto): Promise<CreateTeacherResponse> {
    try {
      const response = await apiClient.post<CreateTeacherResponse>(
        API_ENDPOINTS.TEACHER.CREATE_TEACHER,
        data
      );
      return response;
    } catch (error) {
      console.error("Create teacher error", error);
      throw error;
    }
  }

  // Teacher ma'lumotlarini yangilash
  async updateTeacher(data: UpdateTeacherDto): Promise<UpdateTeacherResponse> {
    try {
      const response = await apiClient.put<UpdateTeacherResponse>(
        API_ENDPOINTS.TEACHER.UPDATE,
        data
      );
      return response;
    } catch (error) {
      console.error("Update teacher error", error);
      throw error;
    }
  }

  // Teacher o'chirish
  async deleteTeacher(teacherId: number): Promise<DeleteTeacherResponse> {
    try {
      const response = await apiClient.delete<DeleteTeacherResponse>(
        API_ENDPOINTS.TEACHER.DELETE(teacherId)
      );
      return response;
    } catch (error) {
      console.error("Delete teacher error", error);
      throw error;
    }
  }
}

export const teacherService = new TeacherService();