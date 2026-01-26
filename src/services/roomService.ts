import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import { CreateRoomDto, CreateRoomResponse, DeleteRoomResponse, RoomListResponse, RoomResponse } from "../types/room";


class RoomService {
  // Barcha xonanalarni olish
  async getRooms(): Promise<RoomListResponse> {
    try {
      const response = await apiClient.get<RoomListResponse>(
        API_ENDPOINTS.ROOM.LIST
      );
      return response;
    } catch (error) {
      console.error("Get rooms error:", error);
      throw error;
    }
  }

  // ID bo'yicha xona olish
  async getRoomById(roomId: string | number): Promise<RoomResponse> {
    try {
      const url = API_ENDPOINTS.ROOM.GET_BY_ID(roomId);
      const response = await apiClient.get<RoomResponse>(url);
      return response;
    } catch (error) {
      console.error("Get room by ID error:", error);
      throw error;
    }
  }

  // Yangi xona yaratish
  async createRoom(data: CreateRoomDto): Promise<CreateRoomResponse> {
    try {
      const response = await apiClient.post<CreateRoomResponse>(
        API_ENDPOINTS.ROOM.CREATE,
        data
      );
      return response;
    } catch (error) {
      console.error("Create room error:", error);
      throw error;
    }
  }

  // Xona o'chirish
  async deleteRoom(roomId: string | number): Promise<DeleteRoomResponse> {
    try {
      const url = API_ENDPOINTS.ROOM.DELETE(roomId);
      const response = await apiClient.delete<DeleteRoomResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete room error:", error);
      throw error;
    }
  }
}



export const roomService = new RoomService();
