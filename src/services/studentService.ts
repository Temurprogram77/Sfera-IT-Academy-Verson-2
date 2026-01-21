
import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
class StudentService {
  private readonly endpoint = API_ENDPOINTS.STUDENT.GETALLSTUDENT;

  async getAllStudents(params?: Record<string, string | number | boolean>) {
    const url = buildUrlWithParams(this.endpoint, params);
    return apiClient.get(url);
  }
}

export const studentService = new StudentService();