export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  uploadedImageUrl?: string;
  onRemove?: () => void;
  disabled?: boolean;
  uploadProgress?: number;
  isUploading?: boolean;
}