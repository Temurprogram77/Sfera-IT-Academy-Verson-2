import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Label from "../form/Label";
import { Button } from "antd";
import { useLogin } from "../../hooks/useAuth";
import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";
import { useTranslation } from "react-i18next";
import PhoneInput from "../ui/input/PhoneInput";
import PasswordInput from "../ui/input/PasswordInput";
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

const phoneOptions = {
  ...basePhoneOptions,
  lazy: false,
};

export default function SignInForm() {
  const inputRef = useMaskito({ options: phoneOptions });

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { t } = useTranslation();
  const { refreshAuth } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error(t("enterPhoneAndPassword"));
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("998")) {
      toast.error(t("phoneMustStartWith998"));
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        phone: cleanPhone,
        password,
      });

      if (!response?.success) {
        toast.error(t("invalidPhoneOrPassword"));
        return;
      }

      // Token va role localStorage'ga saqlash
      localStorage.setItem("auth_token", response.data);
      localStorage.setItem("user_role", response.message);

      // AuthContext'ni yangilash
      refreshAuth();

      // Role'ga qarab redirect
      const role = String(response.message).trim();
      const redirectPath = ROLE_REDIRECTS[role] || "/dashboard/student";

      toast.success(t("welcome"));

      // Kichik kechikish bilan navigate qilish
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);

    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || error?.message || t("loginError"),
        );
      } else {
        toast.error(t("loginError"));
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
            {t("login")}
          </h1>
          <p className="text-sm text-gray-500">{t("enterCredentials")}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>
                {t("phone")} <span className="text-error-500">*</span>
              </Label>

              <PhoneInput
                ref={inputRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                disabled={loginMutation.isPending}
              />
            </div>

            <div>
              <Label>
                {t("password")} <span className="text-error-500">*</span>
              </Label>

              <div className="relative">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password")}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full !bg-[#032E15] hover:!bg-[#032E15]"
              loading={loginMutation.isPending}
              size="large"
            >
              {loginMutation.isPending ? `${t("login")}...` : t("login")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}