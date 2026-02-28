import { apiClient } from "../lib/api/client";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  IInactiveStudentsResponse,
  IActivateStudentResponse,
  IInactiveStudent, // Massiv uchun buni ham import qiling
} from "../types/inactives";

const InActivesService = {
  // Qaytarish tipi IInactiveStudent[] (massiv) bo'lishi kerak, 
  // chunki siz response.data.data ni qaytarayotgan bo'lishingiz mumkin
  getAll: async (): Promise<IInactiveStudent[]> => {
    const response = await apiClient.get<IInactiveStudentsResponse>(API_ENDPOINTS.STUDENT.INACTIVE);
    
    // Agar API success/message/data formatida bo'lsa:
    return response.data; 
  },

  activate: async (studentId: string | number): Promise<IActivateStudentResponse> => {
    const response = await apiClient.put<IActivateStudentResponse>(
      API_ENDPOINTS.STUDENT.INACTIVE_UPDATE(studentId)
    );
    
    // Agar response.data null bo'lishi mumkin bo'lsa, xatolikni oldini olamiz
    if (!response.data) {
      throw new Error("Aktivlashtirishda ma'lumot qaytmadi");
    }
    
    return response.data;
  },
};

export default InActivesService;