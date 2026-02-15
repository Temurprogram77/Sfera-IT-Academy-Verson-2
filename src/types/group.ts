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

export interface GroupStudent {
  id: number;
  fulName: string;
  imgUrl: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
}

export interface GroupDetail {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  weekDays: string[];
  teacherId: number | null;
  categoryId: number;
  roomId: number | null;
  teacherName?: string | null;
  categoryName?: string;
  roomName?: string | null;
  students?: GroupStudent[];
}

export interface GroupListParams extends Record<string, string | number | undefined> {
  name?: string;
  teacherId?: number;
  categoryId?: number;
  page?: number;
  size?: number;
}

export interface GroupDaysParams {
  groupId: number;
  yearMonth: string; // Format: YYYY-MM
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

// Week days enum for better type safety
export enum WeekDay {
  oddDays = "Toq kunlari",
  evenDays = "Juft kunlari",
  otherDays = "Boshqa kunlar",
}