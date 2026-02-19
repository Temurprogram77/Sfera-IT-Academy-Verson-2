import { useModal } from "../../hooks/useModal";
import { formatPhone } from "../../utils/phoneFormatter";
import IconButton from "../IconButton/IconButton";
import ModalComponent from "../Modal/Modal";
import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import PasswordInput from "../ui/input/PasswordInput";
import PhoneInput from "../ui/input/PhoneInput";
import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";
import { toast } from "sonner";
import Label from "../form/Label";
import { userService } from "../../services/userService";
import { adminService } from "../../services/adminService";
import FileUpload from "../Input/FileUpload";
import InputComponent from "../Input/Input";
import { useFileUpload } from "../../hooks/useFileUpload";
import { User } from "../../types/user";
import { Image } from "antd";

const basePhoneOptions = maskitoPhoneOptionsGenerator({
  countryIsoCode: "UZ",
  metadata,
  strict: false,
});
const phoneOptions = { ...basePhoneOptions, lazy: false };

interface UserMetaCardProps {
  user: User;
  refetch?: () => Promise<void>;
}

export default function UserMetaCard({ user, refetch }: UserMetaCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const inputRef = useMaskito({ options: phoneOptions });
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const [mode, setMode] = useState<"password" | "profile">("password");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const avatarUrl = user?.imageUrl;

  useEffect(() => {
    if (user) {
      const formattedPhone = user.phone?.startsWith("+")
        ? user.phone
        : `+${user.phone || ""}`;

      setPhone(formattedPhone);
      setFullName(user.fullName || "");
      setImageUrl(avatarUrl || "");
      setPassword("");
    }
  }, [user, avatarUrl]);

  const handleModalClose = () => {
    closeModal();
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "password") {
        if (!password) {
            toast.error("Parol kiriting");
            return;
        }

        const cleanPhone = phone.replace(/\D/g, "");
        const response = await userService.updatePassword({
          phone: cleanPhone,
          password,
        });

        if (response.success) {
          toast.success(response.message);
          await refetch?.();
          handleModalClose();
        } else {
          toast.error(response.message);
        }
      } else {
        if (!fullName || !phone) {
            toast.error("To'liq ma'lumot kiriting");
            return;
        }

        let finalImageUrl = imageUrl;

        if (selectedFile) {
          const uploaded = await uploadFile(selectedFile);
          if (uploaded) finalImageUrl = uploaded;
        }

        const cleanPhone = phone.replace(/\D/g, "");
        const response = await adminService.updateAdmin({
          id: user.id,
          fullName,
          phone: cleanPhone,
          imageUrl: finalImageUrl,
        });

        if (response.success) {
          toast.success(response.message);
          await refetch?.();
          handleModalClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Xatolik yuz berdi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow flex-shrink-0">
              {avatarUrl ? (
                <Image
                  src={user.imageUrl || ""}
                  alt={user.fullName}
                  preview={{
                    mask: <div className="text-white text-sm">Ko‘rish</div>,
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              {user.fullName && (
                <h3 className="text-lg font-semibold dark:text-white">
                  {user.fullName}
                </h3>
              )}
              {user.phone && (
                <p className="text-sm text-gray-500">
                  {formatPhone(user.phone)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <IconButton
              text="Parolni yangilash"
              icon={<LockOutlined />}
              onClick={() => {
                setMode("password");
                openModal();
              }}
            />
            <IconButton
              text="Profilni tahrirlash"
              icon={<UserOutlined />}
              onClick={() => {
                setMode("profile");
                openModal();
              }}
            />
          </div>
        </div>
      </div>

      <ModalComponent
        open={isOpen}
        title={
          mode === "password" ? "Parolni yangilash" : "Profilni tahrirlash"
        }
        onCancel={handleModalClose}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "password" && (
            <>
              <div>
                <Label>Telefon</Label>
                <PhoneInput ref={inputRef} value={phone} disabled />
              </div>
              <div>
                <Label>Yangi parol</Label>
                <PasswordInput
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {mode === "profile" && (
            <>
              <InputComponent
                label="To'liq ism"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFullName(e.target.value)}
              />
              <div>
                <Label>Telefon</Label>
                <PhoneInput
                  ref={inputRef}
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <FileUpload
                onFileSelect={(file: File | null) => setSelectedFile(file)}
                uploadedImageUrl={imageUrl}
                onRemove={() => {
                  setImageUrl("");
                  setSelectedFile(null);
                }}
                uploadProgress={uploadProgress.percent}
                isUploading={isUploading}
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <IconButton text="Bekor qilish" onClick={handleModalClose} />
            <IconButton
              text={isLoading ? "Saqlanmoqda..." : "Saqlash"}
              htmlType="submit"
              type="primary"
              disabled={isLoading || isUploading}
            />
          </div>
        </form>
      </ModalComponent>
    </>
  );
}
