export interface Notification {
  id: number;
  message: string;
  description: string;
  studentId: number | null;
  parentId: number | null;
  read: boolean;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Notification[];
  };
}

export interface NotificationMyResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export interface NotificationOneResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface NotificationCountResponse {
  success: boolean;
  message: string;
  data: number;
}

export interface CreateNotificationDto {
  message: string;
  description: string;
  studentId?: number;
  parentId?: number;
}

export interface CreateNotificationWithGroupDto {
  message: string;
  description: string;
  groupId: number;
}

export interface ReadNotificationDto {
  idList: number[];
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: null | string;
}

export interface NotificationListParams {
  page?: number;
  size?: number;
}
