import { useState } from "react";
import { Form, Input, Popconfirm, Progress, Spin } from "antd";
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

const Admins = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Admin | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = Form.useForm();

  const {
    data,
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
    setEditingStudent(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (admin: Admin) => {
    setIsEditMode(true);
    setEditingStudent(admin);
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

      if (isEditMode && editingStudent) {
        updateAdmin(
          {
            id: editingStudent.id,
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
    <div className="p-4 bg-white dark:bg-gray-900">
      <ListHeader
        title={t("adminsCount")}
        count={data}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchAdmin")}
        buttonText={t("addAdmin")}
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Yuklanmoqda..." />
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
          columnsConfig={[
            {
              key: "admins",
              title: t("admin"),
              render: (record) => (
                <div className="flex items-center gap-3">
                  {record.imageUrl ? (
                    <img
                      src={record.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
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
            {
              key: "actions",
              title: t("actions"),
              render: (record) => (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => openEditModal(record)}
                    disabled={isUpdating}
                  >
                    <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-700" />
                  </button>
                  <Popconfirm
                    title={`${t("student")} ${t("confirmDeleteSuffix")}`}
                    description={`${record.fullName} o'chirilsinmi?`}
                    onConfirm={() => handleDelete(record.id)}
                    okText={t("yes")}
                    cancelText={t("no")}
                    okButtonProps={{ loading: isDeleting }}
                  >
                    <button disabled={isDeleting}>
                      <TrashBinIcon className="w-5 h-5 text-red-600 hover:text-red-700" />
                    </button>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
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
        title={editingStudent ? t("editStudent") : t("addStudent")}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setUploadedImageUrl("");
        }}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isCreating || isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label={t("full_name")}
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("phone")}
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input
              placeholder="+998 90-123-45-67"
              onChange={(e) =>
                form.setFieldValue("phone", formatPhoneDisplay(e.target.value))
              }
            />
          </Form.Item>
          {isEditMode && (
            <Form.Item label={t("image")}>
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

              {isUploading && (
                <Progress
                  percent={uploadProgress.percent}
                  status="active"
                  className="mt-2"
                />
              )}

              <Form.Item name="imgUrl" label="Yoki URL kiriting">
                <Input
                  placeholder="https://example.com/image.jpg"
                  disabled={isUploading}
                  onChange={(e) => setUploadedImageUrl(e.target.value)}
                />
              </Form.Item>
            </Form.Item>
          )}

          {!editingStudent && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </>
          )}
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Admins;
