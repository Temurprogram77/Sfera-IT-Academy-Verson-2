import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { Spin } from "antd";
import { useProfile } from "../hooks/useProfile";

export default function UserProfiles() {
  const { user, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-64">
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500">Xatolik: {error}</p>;
  }
  return (
    <>
      <PageMeta
        title="Sfera IT Academy"
        description="This is React.js Profile Sfera Academy page"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
        </div>
      </div>
    </>
  );
}
