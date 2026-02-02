import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import { FileUploadResponse, UploadProgress } from "../types/file";

class FileService {
  // POST /api/v1/files/upload - Upload file
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<FileUploadResponse>(
        API_ENDPOINTS.FILE.UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress: UploadProgress = {
                percent: Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                ),
                loaded: progressEvent.loaded,
                total: progressEvent.total,
              };
              onProgress(progress);
            }
          },
        }
      );

      return response;
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  }

  // Validate file before upload
  validateFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Only JPG, JPEG, and PNG files are allowed",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  }
}

export const fileService = new FileService();