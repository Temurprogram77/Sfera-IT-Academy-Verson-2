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

export interface RoomListParams extends Record<string, string | number | undefined> {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UseRoomsReturn {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;

  createRoom: (
    data: CreateRoomDto,
    options?: { onSuccess?: () => void },
  ) => void;
  isCreating: boolean;

  updateRoom: (
    data: UpdateRoomDto,
    options?: { onSuccess?: () => void },
  ) => void;
  isUpdating: boolean;

  deleteRoom: (roomId: string | number) => void;
  isDeleting: boolean;
}

export interface UseRoomIdReturn {
  room: Room;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
export interface Schedule {
  id: number;
  subject: string;
  days: string[];
  startTime: string;
  endTime: string;
  teacher: string;
  students: string[];
  room: string;
  description: string;
}
