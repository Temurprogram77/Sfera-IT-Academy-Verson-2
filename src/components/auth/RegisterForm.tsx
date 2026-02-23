import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Label from "../form/Label";
import { Button, ConfigProvider } from "antd";
import { useRegister } from "../../hooks/useAuth";
import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";
import { useTranslation } from "react-i18next";
import PhoneInput from "../ui/input/PhoneInput";
import PasswordInput from "../ui/input/PasswordInput";
import TextInput from "../ui/input/TextInput";
import { useAuthContext } from "../../context/AuthContext";
import { AxiosError } from "axios";

const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: "/dashboard/super_admin",
  ROLE_ADMIN: "/dashboard/admin",
  ROLE_TEACHER: "/dashboard/teacher",
  ROLE_STUDENT: "/dashboard/student",
  ROLE_PARENT: "/dashboard/parent",
};

const basePhoneOptions = maskitoPhoneOptionsGenerator({
  countryIsoCode: "UZ",
  metadata,
  strict: false,
});

const phoneOptions = { ...basePhoneOptions, lazy: false };

export default function RegisterForm() {
  const inputRef = useMaskito({ options: phoneOptions });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const registerMutation = useRegister(); // sizda useRegister hook bo‘lishi kerak
  const { t } = useTranslation();
  const { refreshAuth } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !password || !confirmPassword) {
      toast.error(t("allFieldsRequired"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("998") || cleanPhone.length !== 12) {
      toast.error(t("phoneMustBeValidUZ"));
      return;
    }

    try {
      const response = await registerMutation.mutateAsync({
        firstName,
        lastName,
        phone: cleanPhone,
        password,
      });

      if (!response?.success) {
        toast.error(response?.message || t("registrationFailed"));
        return;
      }

      // muvaffaqiyatli ro‘yxatdan o‘tgandan keyin login qilish yoki token saqlash
      localStorage.setItem("auth_token", response.data?.token || "");
      localStorage.setItem("user_role", response.data?.role || "ROLE_STUDENT");

      refreshAuth();

      const role = (response.data?.role || "ROLE_STUDENT").trim();
      const redirectPath = ROLE_REDIRECTS[role] || "/dashboard/student";

      toast.success(t("registrationSuccess"));

      navigate(redirectPath, { replace: true });
    } catch (error: unknown) {
      console.error("Register error:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            t("registrationError"),
        );
      } else {
        toast.error(t("registrationError"));
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: "#ffffff",
            colorText: "#111827",
            colorBorder: "#d1d5db",
            colorTextPlaceholder: "#6b7280",
            activeBorderColor: "#00A67D",
            hoverBorderColor: "#00A67D",
          },
        },
      }}
    >
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
              {t("register")}
            </h1>
            <p className="text-sm text-gray-500">{t("createNewAccount")}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  {t("firstName")} <span className="text-error-500">*</span>
                </Label>
                <TextInput
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("enterFirstName")}
                  disabled={registerMutation.isPending}
                />
              </div>

              <div>
                <Label>
                  {t("lastName")} <span className="text-error-500">*</span>
                </Label>
                <TextInput
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("enterLastName")}
                  disabled={registerMutation.isPending}
                />
              </div>

              <div>
                <Label>
                  {t("phone")} <span className="text-error-500">*</span>
                </Label>
                <PhoneInput
                  ref={inputRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  disabled={registerMutation.isPending}
                />
              </div>

              <div>
                <Label>
                  {t("password")} <span className="text-error-500">*</span>
                </Label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("createPassword")}
                  disabled={registerMutation.isPending}
                />
              </div>

              <div>
                <Label>
                  {t("confirmPassword")} <span className="text-error-500">*</span>
                </Label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("repeatPassword")}
                  disabled={registerMutation.isPending}
                />
              </div>

              <div className="mt-4 text-center text-sm text-gray-500 w-full flex items-center justify-between gap-1">
                {t("alreadyHaveAccount")}{" "}
                <Link to="/login" className="text-green-600 hover:underline">
                  {t("loginHere")}
                </Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-[#032E15] hover:!bg-[#032E15]"
                loading={registerMutation.isPending}
                size="large"
              >
                {registerMutation.isPending ? `${t("registering")}...` : t("register")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ConfigProvider>
  );
}