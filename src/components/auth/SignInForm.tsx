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
  lazy: false, // +998 darhol ko'rinsin
};

export default function SignInForm() {
  const inputRef = useMaskito({ options: phoneOptions });

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(""); // Maskali qiymat: +998 90 123 45 67
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error("Telefon raqam va parolni kiriting!");
      return;
    }

    // Faqat raqamlarni olamiz: +998 90 123 45 67 → 998901234567
    const cleanPhone = phone.replace(/\D/g, ""); // \D - raqam bo'lmagan hamma belgi

    // Tekshiruv: O'zbekiston raqami 998 bilan boshlanishi kerak
    if (!cleanPhone.startsWith("998")) {
      toast.error("Telefon raqam 998 bilan boshlanishi kerak!");
      return;
    }

    // Agar backend + bilan xohlasa: "+" + cleanPhone
    // Aks holda: cleanPhone (998901234567)

    try {
      const response = await loginMutation.mutateAsync({
        phone: cleanPhone, // API'ga toza raqam yuboriladi: 998901234567
        // agar backend +998901234567 xohlasa, quyidagicha qil:
        // phone: "+" + cleanPhone,
        password,
      });

      if (response.success && response.data) {
        const userRole = response.message as string;
        const redirectPath = ROLE_REDIRECTS[userRole] || "/dashboard/teacher";

        toast.success("Xush kelibsiz!");
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login xatolik!");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
              Kirish
            </h1>
            <p className="text-sm text-gray-500">
              Kirish uchun telefon raqamingiz va parolingizni kiriting!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Telefon input */}
              <div>
                <Label>
                  Telefon <span className="text-error-500">*</span>
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
                  Parol <span className="text-error-500">*</span>
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
                  {loginMutation.isPending ? "Kirish..." : "Kirish"}
                </Button>
              </div>

              {/* Xato xabari */}
              {loginMutation.isError && (
                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {(loginMutation.error as any)?.message ||
                    "Xatolik yuz berdi. Qaytadan urinib ko'ring."}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}