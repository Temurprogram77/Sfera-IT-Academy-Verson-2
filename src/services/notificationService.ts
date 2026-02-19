import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  CreateNotificationDto,
  CreateNotificationWithGroupDto,
  NotificationCountResponse,
  NotificationListParams,
  NotificationListResponse,
  NotificationMyResponse,
  NotificationOneResponse,
  NotificationResponse,
  ReadNotificationDto,
} from "../types/notification";

class NotificationService {
  // GET /notification — faqat ADMIN
  async getAll(
    params?: NotificationListParams,
  ): Promise<NotificationListResponse> {
    try {
      const url = params
        ? `${API_ENDPOINTS.NOTIFICATION.LIST}?page=${params.page ?? 0}&size=${params.size ?? 10}`
        : API_ENDPOINTS.NOTIFICATION.LIST;
      return await apiClient.get<NotificationListResponse>(url);
    } catch (error) {
      console.error("Get notifications error:", error);
      throw error;
    }
  }

  // GET /notification/my — student & parent
  async getMy(): Promise<NotificationMyResponse> {
    try {
      return await apiClient.get<NotificationMyResponse>(
        API_ENDPOINTS.NOTIFICATION.MY,
      );
    } catch (error) {
      console.error("Get my notifications error:", error);
      throw error;
    }
  }

  // GET /notification/count
  async getCount(): Promise<NotificationCountResponse> {
    try {
      return await apiClient.get<NotificationCountResponse>(
        API_ENDPOINTS.NOTIFICATION.COUNT,
      );
    } catch (error) {
      console.error("Get notification count error:", error);
      throw error;
    }
  }

  // GET /notification/{id}
  async getById(id: number | string): Promise<NotificationOneResponse> {
    try {
      return await apiClient.get<NotificationOneResponse>(
        API_ENDPOINTS.NOTIFICATION.GET_BY_ID(id),
      );
    } catch (error) {
      console.error("Get notification by id error:", error);
      throw error;
    }
  }

  // POST /notification — faqat ADMIN
  async create(data: CreateNotificationDto): Promise<NotificationResponse> {
    try {
      return await apiClient.post<NotificationResponse>(
        API_ENDPOINTS.NOTIFICATION.CREATE,
        data,
      );
    } catch (error) {
      console.error("Create notification error:", error);
      throw error;
    }
  }

  // POST /notification/withGroup — faqat ADMIN
  async createWithGroup(
    data: CreateNotificationWithGroupDto,
  ): Promise<NotificationResponse> {
    try {
      return await apiClient.post<NotificationResponse>(
        API_ENDPOINTS.NOTIFICATION.CREATE_WITH_GROUP,
        data,
      );
    } catch (error) {
      console.error("Create notification with group error:", error);
      throw error;
    }
  }

  // PUT /notification/read
  async markAsRead(data: ReadNotificationDto): Promise<NotificationResponse> {
    try {
      return await apiClient.put<NotificationResponse>(
        API_ENDPOINTS.NOTIFICATION.READ,
        data, // { idList: [id] }
      );
    } catch (error) {
      console.error("Mark as read error:", error);
      throw error;
    }
  }

  // DELETE /notification/{id} — faqat ADMIN
  async deleteById(id: number | string): Promise<NotificationResponse> {
    try {
      return await apiClient.delete<NotificationResponse>(
        API_ENDPOINTS.NOTIFICATION.DELETE(id),
      );
    } catch (error) {
      console.error("Delete notification error:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
