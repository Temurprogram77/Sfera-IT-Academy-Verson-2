export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Group {
  id: number;
  name: string;
  teacherName: string | null;
  categoryName: string;
  studentCount: number;
}

export interface GroupDetail {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  teacherId: number;
  categoryId: number;
  roomId: number;
  teacherName?: string;
  categoryName?: string;
  roomName?: string;
}

export interface GroupListParams extends Record<string, string | number | undefined> {
  name?: string;
  teacherId?: number;
  categoryId?: number;
  page?: number;
  size?: number;
}

export interface GroupListResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<Group>;
}

export interface GroupAllResponse {
  success: boolean;
  message: string;
  data: Group[];
}

export interface GroupDetailResponse {
  success: boolean;
  message: string;
  data: GroupDetail;
}

export interface GroupDaysResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface GroupActionResponse {
  success: boolean;
  message: string;
  data: GroupDetail | null;
}

export interface CreateGroupDto {
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  teacherId: number;
  categoryId: number;
  roomId: number;
}

export interface UpdateGroupDto {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  teacherId: number;
  categoryId: number;
  roomId: number;
}

export interface GroupDaysParams {
  groupId: number;
  yearMonth: string; // Format: YYYY-MM
}

// Week days enum for better type safety
export enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}