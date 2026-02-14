export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

export interface Schedule {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  teacherId: number;
  categoryId: number;
  roomId: number;
  roomName?: string;
  teacherName?: string;
  categoryName?: string;
}

export interface TimeSlot {
  start: string; // "12:00:00" formatida
  end: string;   // "14:00:00" formatida
}

export interface WeeklyStat {
  day: string;
  busy: TimeSlot[];
  free: TimeSlot[];
}

export interface Room {
  id: number;
  name: string;
  schedules: Schedule[];
  weeklyStats: WeeklyStat[];
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
  room: Room | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface WeeklyStat {
  day: string;
  busy: TimeSlot[];
  free: TimeSlot[];
}

export interface ChartDataPoint {
  name: string;
  busy: number;
  free: number;
}

export interface PieDataPoint {
  name: string;
  value: number;
}