import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fileService } from "../services/fileService";
import { FileUploadResponse, UploadProgress } from "../types/file";

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percent: 0,
    loaded: 0,
    total: 0,
  });

  const uploadMutation = useMutation<
    FileUploadResponse,
    Error,
    File
  >({
    mutationFn: (file: File) =>
      fileService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      }),
    onSuccess: (data) => {
      toast.success("File uploaded successfully");
      setUploadProgress({ percent: 0, loaded: 0, total: 0 });
      return data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to upload file";
      toast.error(errorMessage);
      setUploadProgress({ percent: 0, loaded: 0, total: 0 });
    },
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    // Validate file first
    const validation = fileService.validateFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid file");
      return null;
    }

    try {
      const result = await uploadMutation.mutateAsync(file);
      return result.data.url;
    } catch (error) {
      return null;
    }
  };

  return {
    uploadFile,
    uploadProgress,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error?.message || null,
  };
};