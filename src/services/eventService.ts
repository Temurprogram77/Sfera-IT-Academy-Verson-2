import { apiClient } from "../lib/api/client";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  IEvent,
  ICreateEvent,
  IUpdateEvent,
  IEventListResponse,
  IEventActionResponse,
} from "../types/event";

export const eventService = {
  // Barcha eventlarni olish
  getAllEvents: async (): Promise<IEvent[]> => {
    try {
      const response = await apiClient.get<IEventListResponse>(
        API_ENDPOINTS.EVENT.LIST
      );

      if (response.data?.success && response.data?.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error("Eventlarni yuklashda xatolik:", error);
      return [];
    }
  },

  // Muayyan sana uchun eventlarni olish
  getEventsByDate: async (date: string): Promise<IEvent[]> => {
    try {
      const response = await apiClient.get<IEventListResponse>(
        `${API_ENDPOINTS.EVENT.GET_BY_DATE}?date=${date}`
      );

      if (response.data && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error(`${date} uchun eventlarni yuklashda xatolik:`, error);
      return [];
    }
  },

  // Event yaratish
  createEvent: async (data: ICreateEvent): Promise<IEvent | null> => {
    const response = await apiClient.post<IEventActionResponse>(
      API_ENDPOINTS.EVENT.CREATE,
      data
    );

    if (response.data?.success) {
      return response.data.data;
    }

    return null;
  },

  // Event yangilash
  updateEvent: async (data: IUpdateEvent): Promise<IEvent | null> => {
    const response = await apiClient.put<IEventActionResponse>(
      API_ENDPOINTS.EVENT.UPDATE,
      data
    );

    if (response.data?.success) {
      return response.data.data;
    }

    return null;
  },

  // Event o'chirish
  deleteEvent: async (eventId: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EVENT.DELETE(eventId));
  },
};