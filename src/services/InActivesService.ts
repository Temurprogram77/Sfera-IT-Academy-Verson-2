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
    await apiClient.put(
      API_ENDPOINTS.STUDENT.INACTIVE_UPDATE(studentId),
      {}
    );
    // PUT muvaffaqiyatli bo'lsa (xato otmasdan o'tsa), success deb hisoblaymiz
    return { success: true, message: "Activated" };
  },
};

export default InActivesService;