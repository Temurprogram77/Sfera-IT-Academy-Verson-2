import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  StudentListResponse,
  StudentResponse,
  CreateStudentDto,
  StudentActionResponse,
  UpdateStudentDto,
  StudentListParams,
} from "../types/student";

class StudentService {
  // GET /student - Get all students
  async getStudents(params?: StudentListParams): Promise<StudentListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.STUDENT.LIST, params);
      const response = await apiClient.get<StudentListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get students error:", error);
      throw error;
    }
  }

  // GET /student/:id - Get student by ID
  async getStudentById(studentId: string | number): Promise<StudentResponse> {
    try {
      const url = API_ENDPOINTS.STUDENT.GET_BY_ID(studentId);
      const response = await apiClient.get<StudentResponse>(url);
      return response;
    } catch (error) {
      console.error("Get student by ID error:", error);
      throw error;
    }
  }

  // POST /student/saveStudent - Create new student
  async createStudent(data: CreateStudentDto): Promise<StudentActionResponse> {
    try {
      const response = await apiClient.post<StudentActionResponse>(
        API_ENDPOINTS.STUDENT.CREATE_STUDENT,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create student error:", error);
      throw error;
    }
  }

  // PUT /student - Update student
  async updateStudent(data: UpdateStudentDto): Promise<StudentActionResponse> {
    try {
      const response = await apiClient.put<StudentActionResponse>(
        API_ENDPOINTS.STUDENT.UPDATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update student error:", error);
      throw error;
    }
  }

  // DELETE /student/:id - Delete student
  async deleteStudent(
    studentId: string | number,
  ): Promise<StudentActionResponse> {
    try {
      const url = API_ENDPOINTS.STUDENT.DELETE(studentId);
      const response = await apiClient.delete<StudentActionResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete student error:", error);
      throw error;
    }
  }
}

export const studentService = new StudentService();
