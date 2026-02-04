import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";

import { useProfile } from "../../hooks/useProfile";
import { formatPhone } from "../../utils/phoneFormatter";

import { Spin } from "antd";
import { useTranslation } from "react-i18next";

export default function UserInfoCard() {
  const { isOpen, closeModal } = useModal();
  const { user, loading, error } = useProfile();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip={t("loading")} />
      </div>
    );
  }

  /* =========================
      ERROR
  ========================== */
  if (error) {
    return <p className="text-red-500">Xatolik: {error}</p>;
  }

  /* =========================
      ROLE FORMAT
  ========================== */
  const renderRole = () => {
    const role = user?.role;

    switch (role) {
      case "ROLE_ADMIN":
        return "Admin";
      case "ROLE_SUPER_ADMIN":
        return "Super Admin";
      case "ROLE_TEACHER":
        return "O‘qituvchi";
      case "ROLE_STUDENT":
        return "O‘quvchi";
      case "ROLE_PARENT":
        return "Ota-ona";
      default:
        return "Noma’lum rol";
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {/* =========================
          PROFILE INFO
      ========================== */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("personalInformation")}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">

            {/* ROLE */}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Role
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {renderRole()}
              </p>
            </div>

            {/* FULL NAME */}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("fullname")}
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.fullName}
              </p>
            </div>

            {/* PHONE */}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("phone")}
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatPhone(user?.phone)}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          MODAL
      ========================== */}
      <Modal open={isOpen} onCancel={closeModal} title={"Modal"}>

        <div className="no-scrollbar w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">

          {/* HEADER */}
          <div className="px-2 pr-14 mb-6">

            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("editPersonalInformation")}
            </h4>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("updateProfileDetails")}
            </p>

          </div>
        </div>
      </Modal>
    </div>
  );
}
