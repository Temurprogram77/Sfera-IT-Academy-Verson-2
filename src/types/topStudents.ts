export interface TopStudent {
  studentId: number;
  studentName: string;
  totalScore: number;
  imageUrl: string;
}

export interface TopStudentsResponse {
  success: boolean;
  message: string;
  data: TopStudent[];
}