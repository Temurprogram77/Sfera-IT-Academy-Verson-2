import { useState } from "react";
import { Form, Popconfirm, Spin } from "antd";
import Input from "../../components/Input/Input";
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

const Parents = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Parent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = Form.useForm();

  const {
    data,
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
  console.log(data);

  // Modal functions
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingStudent(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (student: Parent) => {
    setIsEditMode(true);
    setEditingStudent(student);
    setUploadedImageUrl(student.imageUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      fullName: student.fullName,
      phone: student.phone,
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
        updateParent(
          {
            id: editingStudent.id,
            fullName: values.fullName,
            phone: normalizePhone(values.phone),
            imgUrl: finalImageUrl || "",
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
            imgUrl: finalImageUrl || "",
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
    <div className="p-4 bg-white dark:bg-gray-900">
      <ListHeader
        title={t("parentsCount")}
        count={data}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchStudent")}
        buttonText={t("addStudent")}
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Yuklanmoqda..." />
        </div>
      ) : parents.length === 0 ? (
        <NotFoundData
          title="O'qituvchilar topilmadi"
          description="Hozircha hech qanday o'qituvchi qo'shilmagan"
        />
      ) : (
        <TableComponent<Parent>
          data={parents}
          itemName={t("student")}
          searchKeys={["fullName", "phone"]}
          columnsConfig={[
            {
              key: "student",
              title: t("student"),
              render: (record) => (
                <div className="flex items-center gap-3">
                  {record.imgUrl ? (
                    <img
                      src={record.imgUrl}
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
            showTotal: (total) => `Jami: ${total} ta ota-ona`,
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
          setCurrentPage(0);
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
            </Form.Item>
          )}

          {!editingStudent && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input placeholder="Enter password" />
              </Form.Item>

              <Form.Item
                name="parentName"
                label="Parent Name"
                rules={[
                  { required: true, message: "Please enter parent name" },
                ]}
              >
                <Input placeholder="Enter parent name" />
              </Form.Item>

              <Form.Item
                name="parentPhone"
                label="Parent Phone"
                rules={[
                  { required: true, message: "Please enter parent phone" },
                ]}
              >
                <Input
                  placeholder="+998 90-123-45-67"
                  onChange={(e) =>
                    form.setFieldValue(
                      "parentPhone",
                      formatPhoneDisplay(e.target.value),
                    )
                  }
                />
              </Form.Item>
            </>
          )}
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Parents;
