// services/attendanceService.ts

import { apiClient } from "../lib/api/client";
import {
  CreateAttendanceDto,
  AttendanceDetailResponse,
  DeleteAttendanceResponse,
} from "../types/attendance";

const BASE = "/attendance";

class AttendanceService {
  // POST /attendance?groupId=17
  async createAttendance(
    groupId: number | string,
    data: CreateAttendanceDto[]
  ): Promise<void> {
    await apiClient.post(`${BASE}?groupId=${groupId}`, data);
  }

  // GET /attendance/:attendanceId
  async getAttendanceById(id: number | string): Promise<AttendanceDetailResponse> {
    return apiClient.get<AttendanceDetailResponse>(`${BASE}/${id}`);
  }

  // ✅ DELETE /attendance/attendanceId?attendanceId=48
  async deleteAttendance(attendanceId: number | string): Promise<DeleteAttendanceResponse> {
    return apiClient.delete<DeleteAttendanceResponse>(
      `${BASE}/attendanceId?attendanceId=${attendanceId}`
    );
  }
}

export const attendanceService = new AttendanceService();