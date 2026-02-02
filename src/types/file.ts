// ============= FILE UPLOAD TYPE =============
export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    fileName: string;
    fileSize: number;
    contentType: string;
  };
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}