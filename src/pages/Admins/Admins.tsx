import { useState } from "react";
import { Image, Popconfirm, Spin } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useAdmins } from "../../hooks/useAdmin";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Admin } from "../../types/admin";
import { PencilIcon, TrashBinIcon } from "../../icons";
import NotFoundData from "../OtherPage/NotFoundData";
import FileUpload from "../../components/Input/FileUpload";
import { formatPhoneDisplay } from "../../utils/phone";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import PhoneInput from "../../components/Input/PhoneInput";
import IconButton from "../../components/IconButton/IconButton";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const Admins = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = FormWrapper.useForm();

  const {
    admins,
    loading,
    pagination,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdmins({ name: searchTerm, page: currentPage, size: pageSize });
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  // Modal functions
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingAdmin(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (admin: Admin) => {
    setIsEditMode(true);
    setEditingAdmin(admin);
    setUploadedImageUrl(admin?.imageUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      fullName: admin.fullName,
      phone: admin.phone,
    });
    setIsModalVisible(true);
  };
  const normalizePhone = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (!digits.startsWith("998")) {
      digits = "998" + digits;
    }

    return digits;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let finalImageUrl = uploadedImageUrl;

      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      if (isEditMode && editingAdmin) {
        updateAdmin(
          {
            id: editingAdmin.id,
            fullName: values.fullName,
            phone: normalizePhone(values.phone),
            imageUrl: finalImageUrl || "",
          },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              form.resetFields();
              setUploadedImageUrl("");
              setSelectedFile(null);
            },
          },
        );
      } else {
        createAdmin(
          {
            fullName: values.fullName,
            phone: normalizePhone(values.phone),
            password: values.password,
          },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              form.resetFields();
              setUploadedImageUrl("");
              setSelectedFile(null);
            },
          },
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleDelete = (id: number) => {
    deleteAdmin(id);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title={t("adminsCount")}
        count={pagination.totalElements}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchAdmin")}
        buttonText={t("addAdmin")}
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : admins.length === 0 ? (
        <NotFoundData
          title="Adminlar topilmadi"
          description="Hozircha hech qanday adminlar qo'shilmagan"
        />
      ) : (
        <TableComponent<Admin>
          data={admins}
          itemName={t("admins")}
          searchKeys={["fullName", "phone"]}
          viewPath={(id) => `/admins/${id}`}
          columnsConfig={[
            {
              key: "admins",
              title: t("admin"),
              render: (record) => (
                <div className="flex items-center gap-3">
                  {record.imageUrl ? (
                    <Image
                      src={record.imageUrl}
                      width={40}
                      height={40}
                      preview={{ mask: "Ko‘rish" }}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                      {record.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{record.fullName}</div>
                    <div className="text-xs text-gray-500">
                      {formatPhoneDisplay(record.phone)}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "phone",
              title: t("phone"),
              render: (record) => formatPhoneDisplay(record.phone),
            },
          ]}
          onEdit={openEditModal}
          onDelete={handleDelete}
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: pagination.totalElements,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta admin`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      )}

      <ModalComponent
        open={isModalVisible}
        title={editingAdmin ? t("editAdmin") : t("addAdmin")}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setUploadedImageUrl("");
        }}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isCreating || isUpdating || isUploading}
      >
        <FormWrapper form={form} layout="vertical">
          <FormWrapper.Item
            name="fullName"
            label={t("full_name")}
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <InputComponent placeholder="Enter full name" />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="phone"
            label={t("phone")}
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^998\d{9}$/,
                message: "To'g'ri formatda kiriting! (998XXXXXXXXX)",
              },
            ]}
          >
            <PhoneInput placeholder="+998 90 123 45 67" />
          </FormWrapper.Item>
          {isEditMode && (
            <FormWrapper.Item label={t("image")}>
              <FileUpload
                onFileSelect={(file) => setSelectedFile(file)}
                uploadedImageUrl={uploadedImageUrl}
                onRemove={() => {
                  setUploadedImageUrl("");
                  setSelectedFile(null);
                }}
                uploadProgress={uploadProgress.percent}
                isUploading={isUploading}
              />
            </FormWrapper.Item>
          )}

          {!editingAdmin && (
            <FormWrapper.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <InputComponent variant="password" placeholder="Enter password" />
            </FormWrapper.Item>
          )}
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default Admins;
