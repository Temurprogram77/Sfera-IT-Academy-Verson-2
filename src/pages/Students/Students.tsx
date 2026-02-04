import { useState } from "react";
import { Form, Input, Popconfirm, Select, Upload, Progress, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useStudents } from "../../hooks/useStudent";
import { useGroups } from "../../hooks/useGroups";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Student } from "../../types/student";
import { PencilIcon, TrashBinIcon } from "../../icons";

const { Dragger } = Upload;

const Students = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = Form.useForm();

  // Hooks
  const {
    students,
    loading,
    pagination,
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStudents({ name: searchTerm, page: currentPage, size: pageSize });
  const { groups, loading: groupsLoading } = useGroups();
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

  const openEditModal = (student: Student) => {
    setIsEditMode(true);
    setEditingStudent(student);
    setUploadedImageUrl(student.imgUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      fullName: student.fulName,
      phoneNumber: student.phoneNumber,
      groupId: student.groupId,
    });
    setIsModalVisible(true);
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
        updateStudent(
          {
            id: editingStudent.id,
            fullName: values.fullName,
            phone: values.phoneNumber.replace(/\s/g, ""),
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
      } else {
        createStudent(
          {
            fullName: values.fullName,
            phone: values.phoneNumber.replace(/\s/g, ""),
            password: values.password,
            parentPhone: values.parentPhone,
            parentName: values.parentName,
            groupId: values.groupId,
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
    deleteStudent(id);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  // File upload props
  const uploadProps: UploadProps = {
    multiple: false,
    beforeUpload: (file) => {
      setSelectedFile(file);
      return false;
    },
    showUploadList: false,
  };

  // Phone display formatter
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length <= 3) return `+${digits}`;
    if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8)}`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      <ListHeader
        title={t("studentsCount")}
        count={students.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchStudent")}
        buttonText={t("addStudent")}
        onButtonClick={openAddModal}
      />

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip={t("loading")} />
        </div>
      )}

      <TableComponent<Student>
        data={students}
        itemName={t("student")}
        searchKeys={["fulName", "groupName", "phoneNumber"]}
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
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold"></div>
                )}
                <div>
                  <div className="font-medium">{record.fulName}</div>
                  <div className="text-xs text-gray-500">
                    {formatPhoneDisplay(record.phoneNumber)}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "group",
            title: t("group"),
            render: (record) => record.groupName,
          },
          {
            key: "phone",
            title: t("phone"),
            render: (record) => formatPhoneDisplay(record.phoneNumber),
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
          showTotal: (total) => `Jami: ${total} ta o'quvchi`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />

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
            name="phoneNumber"
            label={t("phone")}
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input
              placeholder="+998 90-123-45-67"
              onChange={(e) =>
                form.setFieldValue(
                  "phoneNumber",
                  formatPhoneDisplay(e.target.value),
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="groupId"
            label={t("group")}
            rules={[{ required: true, message: "Please select a group" }]}
          >
            <Select
              placeholder="Select a group"
              loading={groupsLoading}
              showSearch
              optionFilterProp="children"
              options={groups.map((g) => ({ value: g.id, label: g.name }))}
            />
          </Form.Item>

          <Form.Item label={t("image")}>
            <Dragger {...uploadProps} disabled={isUploading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Rasmni bosing yoki sudrab keling
              </p>
              <p className="ant-upload-hint">JPG, PNG, JPEG • Max 5MB</p>
            </Dragger>

            {isUploading && (
              <Progress
                percent={uploadProgress.percent}
                status="active"
                className="mt-2"
              />
            )}

            {uploadedImageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded"
                  className="w-20 h-20 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImageUrl("");
                    form.setFieldValue("imgUrl", "");
                  }}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </Form.Item>

          <Form.Item name="imgUrl" label="Yoki URL kiriting">
            <Input
              placeholder="https://example.com/image.jpg"
              disabled={isUploading}
              onChange={(e) => setUploadedImageUrl(e.target.value)}
            />
          </Form.Item>

          {!editingStudent && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password placeholder="Enter password" />
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

export default Students;
