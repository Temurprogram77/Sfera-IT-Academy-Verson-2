export interface IInactiveStudent {
  id: number;
  fulName: string;
  imgUrl: string | null;
  phoneNumber: string;
  groupId: number | null;
  groupName: string | null;
  parentId: number | null;
  parentName: string | null;
  parentPhone: string | null;
}

export interface IInactiveStudentsResponse {
  success: boolean;
  message: string;
  data: IInactiveStudent[];
}

export interface IActivateStudentResponse {
  success: boolean;
  message: string;
  data?: null;
}