import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sfera IT Academy – Tizimga kirish"
        description="Sfera IT Academy platformasiga kirish uchun foydalanuvchi nomi va parolingizni kiriting"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
