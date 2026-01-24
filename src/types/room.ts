export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

export interface Room {
  id: number;
  name: string;
  schedules: Schedule[] | null;
}

export interface Schedule {
  id: number;
  roomId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomDto {
  name: string;
}

export interface UpdateRoomDto {
  id: number;
  name: string;
}

export interface RoomListResponse {
  success: boolean;
  message: string;
  data: Room[];
}

export interface RoomResponse {
  success: boolean;
  message: string;
  data: Room;
}

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface DeleteRoomResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface RoomListParams {
  page?: number;
  limit?: number;
  search?: string;
}