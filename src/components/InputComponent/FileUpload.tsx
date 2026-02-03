import { Upload, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useState } from "react";

const { Dragger } = Upload;

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  uploadedImageUrl?: string;
  onRemove?: () => void;
  disabled?: boolean;
  uploadProgress?: number;
  isUploading?: boolean;
}

const FileUpload = ({
  onFileSelect,
  uploadedImageUrl,
  onRemove,
  disabled = false,
  uploadProgress = 0,
  isUploading = false,
}: FileUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: "image/jpeg,image/png,image/jpg",
    showUploadList: false,
    disabled: disabled || isUploading,
    beforeUpload: (file) => {
      // File ni saqlash va preview ko'rsatish
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect(file);

      return false;
    },
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onFileSelect(null);
    onRemove?.();
  };

  return (
    <div>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Rasmni bosing yoki sudrab keling</p>
        <p className="ant-upload-hint">JPG, PNG, JPEG • Max 5MB</p>
      </Dragger>

      {isUploading && (
        <Progress
          percent={uploadProgress}
          status="active"
          className="mt-2"
        />
      )}

      {(previewUrl || uploadedImageUrl) && !isUploading && (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={previewUrl || uploadedImageUrl}
            alt="Uploaded"
            className="w-20 h-20 rounded object-cover border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 text-sm hover:text-red-700 font-medium"
          >
            O'chirish
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;