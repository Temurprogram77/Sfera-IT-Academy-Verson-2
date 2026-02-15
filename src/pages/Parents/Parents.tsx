import { useState } from "react";
import { Image, Popconfirm, Spin } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useParents } from "../../hooks/useParent";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Parent } from "../../types/parent";
import { PencilIcon, TrashBinIcon } from "../../icons";
import NotFoundData from "../OtherPage/NotFoundData";
import FileUpload from "../../components/Input/FileUpload";
import { formatPhoneDisplay } from "../../utils/phone";
import PhoneInput from "../../components/Input/PhoneInput";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import IconButton from "../../components/IconButton/IconButton";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const Parents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = FormWrapper.useForm();

  const {
    parents,
    loading,
    pagination,
    createParent,
    updateParent,
    deleteParent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useParents({ name: searchTerm, page: currentPage, size: pageSize });
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();
  const handleView = (id: number) => {
    navigate(`/parents/${id}`);
  };
  // Modal functions
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingParent(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (parents: Parent) => {
    setIsEditMode(true);
    setEditingParent(parents);
    setUploadedImageUrl(parents.imageUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      fullName: parents.fullName,
      phone: parents.phone,
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

      if (isEditMode && editingParent) {
        updateParent(
          {
            id: editingParent.id,
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
              setCurrentPage(0);
            },
          },
        );
      } else {
        createParent(
          {
            fullName: values.fullName,
            phone: normalizePhone(values.phone),
            password: values.password,
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
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleDelete = (id: number) => {
    deleteParent(id);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title={t("parentsCount")}
        count={pagination.totalElements}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchParent")}
        buttonText={t("addParent")}
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : parents.length === 0 ? (
        <NotFoundData
          title="Ota-onalar topilmadi"
          description="Hozircha hech qanday ota-onalar qo'shilmagan"
        />
      ) : (
        <TableComponent<Parent>
          data={parents}
          itemName={t("parent")}
          searchKeys={["fullName", "phone"]}
          viewPath={(id) => `/parents/${id}`} // Ko‘rish tugmasi ishlashi uchun
          columnsConfig={[
            {
              key: "parent",
              title: t("parent"),
              render: (_: any, record: Parent) => (
                <div className="flex items-center gap-3">
                  {record.imageUrl ? (
                    <Image
                      src={record.imageUrl}
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      preview={{ mask: "Ko‘rish" }}
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
          onEdit={openEditModal} // Tahrirlash tugmasi ishlashi uchun
          onDelete={handleDelete} // O‘chirish tugmasi ishlashi uchun
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: pagination.totalElements,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta ota-ona`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      )}

      <ModalComponent
        open={isModalVisible}
        title={editingParent ? t("editParent") : t("addParent")}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setUploadedImageUrl("");
          setCurrentPage(0);
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
                onFileSelect={(file) => {
                  setSelectedFile(file);
                }}
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

          {!editingParent && (
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

export default Parents;
