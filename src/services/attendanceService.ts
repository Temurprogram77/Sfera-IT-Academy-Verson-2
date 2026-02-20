import { apiClient } from "../lib/api/client";
import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";

export type AttendanceStatus =
  | "KELDI"
  | "KELMADI"
  | "SABABLI"
  | "KECHIKTI";

export interface AttendanceDto {
  studentId: number;
  status: AttendanceStatus;
  description?: string | null;
  date: string; 
}

class AttendanceService {
  async createAttendance(groupId: number, records: AttendanceDto[]) {
    const url = buildUrlWithParams(API_ENDPOINTS.ATTENDANCE.CREATE, {
      groupId,
    });

    return apiClient.post(url, records);
  }

  async deleteAttendance(attendanceId: number | string) {
    return apiClient.delete(
      API_ENDPOINTS.ATTENDANCE.DELETE(attendanceId),
    );
  }
}

export const attendanceService = new AttendanceService();
