import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  AdminActionResponse,
  AdminListParams,
  AdminListResponse,
  AdminResponse,
  CreateAdminDto,
  UpdateAdminDto,
} from "../types/admin";

class AdminService {
  async getAdmins(params?: AdminListParams): Promise<AdminListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.ADMIN.LIST, params);
      const response = await apiClient.get<AdminListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get admins error:", error);
      throw error;
    }
  }
  async getAdminById(adminId: string | number): Promise<AdminResponse> {
    try {
      const url = API_ENDPOINTS.ADMIN.GET_BY_ID(adminId);
      const response = await apiClient.get<AdminResponse>(url);
      return response;
    } catch (error) {
      console.error("Get admin by ID error:", error);
      throw error;
    }
  }
  async createAdmin(data: CreateAdminDto): Promise<AdminActionResponse> {
    try {
      const response = await apiClient.post<AdminActionResponse>(
        API_ENDPOINTS.ADMIN.CREATE_ADMIN,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create admin error:", error);
      throw error;
    }
  }
  async updateAdmin(data: UpdateAdminDto): Promise<AdminActionResponse> {
    try {
      const response = await apiClient.put<AdminActionResponse>(
        API_ENDPOINTS.ADMIN.UPDATE_ADMIN,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update admin error:", error);
      throw error;
    }
  }
  async deleteAdmin(
      adminId: string | number,
    ): Promise<AdminActionResponse> {
      try {
        const url = API_ENDPOINTS.ADMIN.DELETE_ADMIN(adminId);
        const response = await apiClient.delete<AdminActionResponse>(url);
        return response;
      } catch (error) {
        console.error("Delete admin error:", error);
        throw error;
      }
    }
}

export const adminService = new AdminService();
