import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";
import { formatPhone } from "../../utils/phoneFormatter";
import IconButton from "../IconButton/IconButton";
import ModalComponent from "../Modal/Modal";
import { useEffect, useState } from "react";
import { EditFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import PasswordInput from "../ui/input/PasswordInput";
import PhoneInput from "../ui/input/PhoneInput";
import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";
import { toast } from "sonner";
import Label from "../form/Label";
import { userService } from "../../services/userService";
import { adminService } from "../../services/adminService";

const basePhoneOptions = maskitoPhoneOptionsGenerator({
  countryIsoCode: "UZ",
  metadata,
  strict: false,
});
const phoneOptions = { ...basePhoneOptions, lazy: false };

interface UserMetaCardProps {
  user: {
    id: number;
    phone?: string;
    fullName?: string;
    imageUrl?: string;
  };
  refetch?: () => Promise<void>; // async bo‘lishi kerak
}

export default function UserMetaCard({ user, refetch }: UserMetaCardProps) {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const inputRef = useMaskito({ options: phoneOptions });

  const [mode, setMode] = useState<"password" | "profile">("password");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Har doim user props o‘zgarganda state-ni yangilash ---
  useEffect(() => {
    if (user) {
      const formattedPhone = user.phone?.startsWith("+") ? user.phone : `+${user.phone || ""}`;
      setPhone(formattedPhone);
      setFullName(user.fullName || "");
      setImageUrl(user.imageUrl || "");
      setPassword("");
    }
  }, [user]);

  // --- Modal yopilganda state-ni reset qilish ---
  const handleModalClose = () => {
    const formattedPhone = user.phone?.startsWith("+") ? user.phone : `+${user.phone || ""}`;
    setPhone(formattedPhone);
    setFullName(user.fullName || "");
    setImageUrl(user.imageUrl || "");
    setPassword("");
    closeModal();
  };

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "password") {
        // --- Parolni yangilash ---
        if (!password) return toast.error("Parol kiriting");

        const cleanPhone = phone.replace(/\D/g, "");
        if (!cleanPhone.startsWith("998") || cleanPhone.length !== 12) {
          return toast.error("Telefon formati noto‘g‘ri");
        }

        const response = await userService.updatePassword({
          phone: cleanPhone,
          password,
        });

        if (response.success) {
          toast.success(response.message);
          await refetch?.(); // ma’lumotni yangilab olish
          handleModalClose();
        } else {
          toast.error(response.message);
        }
      } else {
        // --- Shaxsiy ma’lumotlarni tahrirlash ---
        if (!fullName || !phone) return toast.error("To‘liq ma’lumot kiriting");

        const cleanPhone = phone.replace(/\D/g, "");

        const response = await adminService.updateAdmin({
          id: user.id,
          fullName,
          phone: cleanPhone,
          imageUrl,
        });

        if (response.success) {
          toast.success(response.message);
          await refetch?.(); // ma’lumotni yangilab olish
          handleModalClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- Card --- */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center">
              <img
                className="object-contain w-16 h-16 dark:hidden"
                src="/images/logoOne.png"
                alt="Logo"
              />
              <img
                className="object-contain w-16 h-16 hidden dark:block"
                src="/images/logoTwo.png"
                alt="Logo Dark"
              />
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.fullName || "-"}
              </h4>

              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatPhone(user.phone)}
                </p>

                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sfera IT Academy
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <IconButton
              text={t("updatePassword") || "Parolni yangilash"}
              icon={<LockOutlined />}
              onClick={() => {
                setMode("password");
                openModal();
              }}
              type="default"
            />

            <IconButton
              text={t("editProfile") || "Shaxsiy ma’lumotlarni yangilash"}
              icon={<UserOutlined />}
              onClick={() => {
                setMode("profile");
                openModal();
              }}
              type="default"
            />
          </div>
        </div>
      </div>

      {/* --- Modal --- */}
      <ModalComponent
        open={isOpen}
        title={
          mode === "password"
            ? t("updatePassword") || "Parolni yangilash"
            : t("editProfile") || "Shaxsiy ma’lumotlarni tahrirlash"
        }
        onCancel={handleModalClose}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* --- Password Mode --- */}
          {mode === "password" && (
            <>
              <div>
                <Label>{t("phone") || "Telefon"}</Label>
                <PhoneInput ref={inputRef} value={phone} disabled />
              </div>

              <div>
                <Label>
                  {t("newPassword") || "Yangi parol"}{" "}
                  <span className="text-error-500">*</span>
                </Label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("enterNewPassword") || "Yangi parolni kiriting"}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {/* --- Profile Mode --- */}
          {mode === "profile" && (
            <>
              <div>
                <Label>
                  {t("fullName") || "To‘liq ism"} <span className="text-error-500">*</span>
                </Label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>
                  {t("phone") || "Telefon"} <span className="text-error-500">*</span>
                </Label>
                <PhoneInput
                  ref={inputRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>{t("imageUrl") || "Rasm URL"}</Label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {/* --- Buttons --- */}
          <div className="flex justify-end gap-3 mt-6">
            <IconButton
              text={t("close") || "Yopish"}
              onClick={handleModalClose}
              type="default"
              disabled={isLoading}
            />

            <IconButton
              text={isLoading ? t("saving") || "Saqlanmoqda..." : t("saveChanges") || "Saqlash"}
              htmlType="submit"
              type="primary"
              disabled={isLoading}
            />
          </div>
        </form>
      </ModalComponent>
    </>
  );
}
