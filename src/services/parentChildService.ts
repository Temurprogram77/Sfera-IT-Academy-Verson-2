import { apiClient } from "../lib/api/client";
import {
  MyChildListResponse,
  ChildStatsResponse,
  ChildMarksResponse,
  ChildAttendanceResponse,
  MarkFilter,
  AttendanceFilter,
} from "../types/parent";

class ParentChildService {
  // GET /parent/my-child — logindagi parentga tegishli barcha bolalar
  async getMyChildren(): Promise<MyChildListResponse> {
    const response = await apiClient.get<MyChildListResponse>("/parent/my-child");
    return response;
  }

  // GET /parent/{studentId}/stats
  async getChildStats(studentId: number | string): Promise<ChildStatsResponse> {
    const response = await apiClient.get<ChildStatsResponse>(
      `/parent/${studentId}/stats`
    );
    return response;
  }

  // GET /parent/{studentId}/marks?filter=WEEKLY|MONTHLY
  async getChildMarks(
    studentId: number | string,
    filter: MarkFilter = "WEEKLY"
  ): Promise<ChildMarksResponse> {
    const response = await apiClient.get<ChildMarksResponse>(
      `/parent/${studentId}/marks?filter=${filter}`
    );
    return response;
  }

  // GET /parent/{studentId}/attendance?filter=WEEKLY|MONTHLY
  async getChildAttendance(
    studentId: number | string,
    filter: AttendanceFilter = "WEEKLY"
  ): Promise<ChildAttendanceResponse> {
    const response = await apiClient.get<ChildAttendanceResponse>(
      `/parent/${studentId}/attendance?filter=${filter}`
    );
    return response;
  }
}

export const parentChildService = new ParentChildService();