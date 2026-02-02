// ============= GROUP TYPE =============
export interface Group {
  id: number;
  name: string;
  teacherName: string;
  categoryName: string;
  studentCount: number;
}

// ============= API RESPONSE =============
export interface GroupListResponse {
  success: boolean;
  message: string;
  data: Group[];
}