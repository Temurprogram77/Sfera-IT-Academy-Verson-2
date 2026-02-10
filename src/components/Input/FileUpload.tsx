import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useState } from "react";
import { FileUploadProps } from "../../types/fileUpload";
import { useTranslation } from "react-i18next";

const { Dragger } = Upload;

const FileUpload = ({
  onFileSelect,
  uploadedImageUrl,
  onRemove,
  disabled = false,
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
   const {t}=useTranslation()
  return (
    <div>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t("dragImageText")}</p>
        <p className="ant-upload-hint">{t("dragImageHint")}</p>
      </Dragger>

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
            {t("remove")}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
