import { apiClient } from "../lib/api/client";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  IInactiveStudentsResponse,
  IActivateStudentResponse,
  IInactiveStudent,
} from "../types/inactives";

const InActivesService = {
  getAll: async (): Promise<IInactiveStudent[]> => {
    const response = await apiClient.get<IInactiveStudentsResponse>(
      API_ENDPOINTS.STUDENT.INACTIVE
    );

    return response.data;
  },

  activate: async (
    studentId: string | number
  ): Promise<IActivateStudentResponse> => {
    const response = await apiClient.put<IActivateStudentResponse>(
      API_ENDPOINTS.STUDENT.INACTIVE_UPDATE(studentId)
    );

    if (!response.data) {
      throw new Error("Aktivlashtirishda response bo‘sh qaytdi");
    }

    return response.data;
  },
};

export default InActivesService;