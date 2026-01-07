import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import { Button, Input } from "antd";
import { useLogin } from "../../hooks/useAuth";
import { useMaskito } from "@maskito/react";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";
import { useTranslation } from "react-i18next";

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

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {t}=useTranslation();

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

      const userRole = response.message as string;
      const redirectPath = ROLE_REDIRECTS[userRole] || "/dashboard/teacher";

      toast.success(t("welcome"));
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("loginError")
      );
    }
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
              {t("login")}
            </h1>
            <p className="text-sm text-gray-500">
              {t("enterCredentials")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Telefon input */}
              <div>
                <Label>
                  {t("phone")} <span className="text-error-500">*</span>
                </Label>
                <input
                  ref={inputRef}
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-[16px] border rounded focus:outline-none focus:border-blue-500 font-mono"
                  disabled={loginMutation.isPending}
                />
              </div>

              {/* Parol input */}
              <div>
                <Label>
                  {t("password")} <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Parolni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loginMutation.isPending}
                    size="large"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-[#032E15] hover:!bg-[#032E15] outline-none"
                  loading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  size="large"
                >
                  {loginMutation.isPending ? `${t('login')}...`: t("login")}
                </Button>
              </div>

              {/* Xato xabari */}
              {loginMutation.isError && (
                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {(loginMutation.error as any)?.message ||
                    t("errorOccurred")}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
