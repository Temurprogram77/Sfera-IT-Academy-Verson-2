import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fileService } from "../services/fileService";
import { UploadProgress } from "../types/file";

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percent: 0,
    loaded: 0,
    total: 0,
  });

  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: (file: File) =>
      fileService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      }),
    onSuccess: () => {
      setUploadProgress({ percent: 0, loaded: 0, total: 0 });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "File yuklashda xatolik";
      toast.error(errorMessage);
      setUploadProgress({ percent: 0, loaded: 0, total: 0 });
    },
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    const validation = fileService.validateFile(file, 5);
    if (!validation.valid) {
      toast.error(validation.error || "Noto'g'ri fayl");
      return null;
    }

    try {
      const url = await uploadMutation.mutateAsync(file);
      return url;
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