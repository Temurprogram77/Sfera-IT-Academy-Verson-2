export interface TopStudent {
  studentId: number;
  studentName: string;
  percent: number;
  imageUrl: string;
}

export interface TopStudentsResponse {
  success: boolean;
  message: string;
  data: TopStudent[];
}