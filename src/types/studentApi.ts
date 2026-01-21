export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: PaginationResponse<T>;
}

export interface PaginationResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Student {
  id: number;
  fulName: string;
  imgUrl: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
}


