import React, { useState, useEffect } from "react";

import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import Button from "../IconButton/IconButton";
import Input from "../Input/Input";
import Label from "../form/Label";
import FormWrapper from "../FormWrapper/FormWrapper";

import { useProfile } from "../../hooks/useProfile";
import { formatPhone } from "../../utils/phoneFormatter";

import { Spin } from "antd";
import { useTranslation } from "react-i18next";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, loading, error } = useProfile();
  const { t } = useTranslation();

  /* =========================
      FORM STATE
  ========================== */
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    fullName: "",
    phone: "",
  });

  /* =========================
      USER → FORM
  ========================== */
  useEffect(() => {
    if (user) {
      setFormData({
        facebook: user?.facebook || "",
        twitter: user?.twitter || "",
        linkedin: user?.linkedin || "",
        instagram: user?.instagram || "",
        fullName: user?.fullName || "",
        phone: user?.phone || "",
      });
    }
  }, [user]);

  /* =========================
      INPUT CHANGE
  ========================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
      SAVE
  ========================== */
  const handleSave = () => {
    console.log("Saved data:", formData);

    // Keyinchalik backend:
    // await updateProfile(formData)

    closeModal();
  };

  /* =========================
      LOADING
  ========================== */
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

            {/* EMAIL */}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("email")}
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email || "sferaAcademy@gmail.com"}
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

          {/* =========================
              FORM
          ========================== */}
          <FormWrapper onSubmit={handleSave} className="flex flex-col">

            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">

              {/* SOCIAL */}
              <div>

                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                  {t("socialLinks")}
                </h5>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                  <div>
                    <Label>{t("facebook")}</Label>
                    <Input
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>{t("linkedin")}</Label>
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>{t("instagram")}</Label>
                    <Input
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </div>

              {/* PERSONAL */}
              <div className="mt-7">

                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                  {t("personalInformation")}
                </h5>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                  <div>
                    <Label>{t("fullname")}</Label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>{t("phone")}</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">

              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={closeModal}
              >
                {t("close")}
              </Button>

              <Button size="sm" type="submit">
                {t("saveChanges")}
              </Button>

            </div>

          </FormWrapper>
        </div>
      </Modal>
    </div>
  );
}
