export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Parent {
  id: number;
  fullName: string;
  phone: string;
  imageUrl: string;
}

export interface ParentListParams extends Record<string, string | number | undefined> {
  name?: string;
  phone?: string;
  page?: number;
  size?: number;
}

export interface ParentListResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<Parent>;
}

export interface ParentResponse {
  success: boolean;
  message: string;
  data: Parent;
}

export interface ParentActionResponse {
  success: boolean;
  message: string;
  data: Parent | null;
}

export interface CreateParentDto {
  fullName: string;
  phone: string;
  imgUrl?: string;
  password: string;
  groupId: number;
  parentPhone: string;
  parentName: string;
}

export interface UpdateParentDto {
  id: number;
  fullName: string;
  phone: string;
  imgUrl: string;
}