import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import { formatPhone } from "../../utils/phoneFormatter";
import IconButton from "../IconButton/IconButton";
import ModalComponent from "../Modal/Modal";
import FormWrapper from "../FormWrapper/FormWrapper";
import InputComponent from "../Input/Input";
import { useEffect } from "react";
import { EditFilled } from "@ant-design/icons";

export default function UserMetaCard({ user }: { user: any }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleSubmit = (values: any) => {
    console.log("Saved:", values);
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
                <img
                  className="object-contain dark:hidden"
                  src="/images/logoOne.png"
                  alt="Logo"
                />
                <img
                  className="object-contain hidden dark:block"
                  src="/images/logoTwo.png"
                  alt="Logo Dark"
                />
              </span>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.fullName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatPhone(user?.phone)}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sfera IT Academy
                </p>
              </div>
            </div>
          </div>
          <IconButton
            text={t("editItem")}
            icon={<EditFilled />}
            onClick={openModal}
            type="default"
          />
        </div>
      </div>

      {/* MODAL */}
      <ModalComponent
        open={isOpen}
        title={t("editPersonalInformation")}
        onCancel={closeModal}
        footer={null}
      >
        <FormWrapper form={form} onFinish={handleSubmit} layout="vertical">
          <h5 className="text-lg font-medium mb-4">{t("socialLinks")}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputComponent name="facebook" label={t("facebook")} />
            <InputComponent name="twitter" label="X.com" />
            <InputComponent name="linkedin" label={t("linkedin")} />
            <InputComponent name="instagram" label={t("instagram")} />
          </div>

          <h5 className="text-lg font-medium mt-6 mb-4">
            {t("personalInformation")}
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputComponent
              name="fullName"
              label={t("fullname")}
              rules={[{ required: true, message: "Ism majburiy" }]}
            />
            <InputComponent
              name="phone"
              label={t("phone")}
              rules={[{ required: true, message: "Telefon majburiy" }]}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <IconButton text={t("close")} onClick={closeModal} type="default" />
            <IconButton
              text={t("saveChanges")}
              htmlType="submit"
              type="primary"
            />
          </div>
        </FormWrapper>
      </ModalComponent>
    </>
  );
}
