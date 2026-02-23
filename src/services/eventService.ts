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
  // Barcha eventlarni olish — GET /event/list
  getAllEvents: async (): Promise<IEvent[]> => {
    try {
      const response = await apiClient.get<IEventListResponse>(
        API_ENDPOINTS.EVENT.LIST,
      );
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Eventlarni yuklashda xatolik:", error);
      return [];
    }
  },

  // Muayyan sana uchun eventlarni olish — GET /event/byDate?date=YYYY-MM-DD
  // Backend: { success: true, message: "Success", data: [...] }
  getEventsByDate: async (date: string): Promise<IEvent[]> => {
    try {
      const response = await apiClient.get<IEventListResponse>(
        `${API_ENDPOINTS.EVENT.GET_BY_DATE}?date=${date}`,
      );
      // To'g'ri parsing — success va data ni tekshiramiz
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error(`${date} uchun eventlarni yuklashda xatolik:`, error);
      return [];
    }
  },

  // Event yaratish — POST /event
  createEvent: async (data: ICreateEvent): Promise<IEvent | null> => {
    const response = await apiClient.post<IEventActionResponse>(
      API_ENDPOINTS.EVENT.CREATE,
      data,
    );
    if (response.data) {
      return response.data;
    }
    return null;
  },

  // Event yangilash — PUT /event/update
  updateEvent: async (data: IUpdateEvent): Promise<IEvent | null> => {
    const response = await apiClient.put<IEventActionResponse>(
      API_ENDPOINTS.EVENT.UPDATE,
      data,
    );
    if (response.data) {
      return response.data;
    }
    return null;
  },

  // Event o'chirish — DELETE /event/{eventId}
  deleteEvent: async (eventId: number | string): Promise<void> => {
    console.log("DELETE eventId:", eventId); // ✅ id kelayaptimi?
    await apiClient.delete(API_ENDPOINTS.EVENT.DELETE(eventId));
  },
};
