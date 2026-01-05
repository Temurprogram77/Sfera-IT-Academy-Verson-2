import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sfera IT Academy SignIn Dashboard"
        description="This is Sfera IT Academy SignIn page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
