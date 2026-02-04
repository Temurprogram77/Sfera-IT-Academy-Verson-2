import { useState } from "react";
import { Form, Input, Popconfirm, Select, Upload, Progress, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/TableComponent/TableComponent";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [form] = Form.useForm();

  // STUDENTS HOOK
  const {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStudents();

  // GROUPS HOOK
  const { groups, loading: groupsLoading } = useGroups();

  // FILE UPLOAD HOOK
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (s) =>
          s.fulName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.phoneNumber.includes(searchTerm),
      )
    : [];

  // PHONE NUMBER FORMATTER
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("998")) return digits;
    if (digits.length >= 3 && digits.startsWith("998")) return digits;
    if (digits.length > 0 && !digits.startsWith("998")) return "998" + digits;
    return digits;
  };

  // PHONE NUMBER DISPLAY FORMATTER
  const formatPhoneDisplay = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `+${digits}`;
    if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5)}`;
    if (digits.length <= 10)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  };

  // MODAL SHOW
  const showModal = (student: Student | null = null) => {
    setEditingStudent(student);
    setUploadedImageUrl("");

    if (student) {
      form.setFieldsValue({
        fulName: student.fulName,
        phoneNumber: student.phoneNumber,
        groupId: student.groupId,
        imgUrl: student.imgUrl || "",
      });
      setUploadedImageUrl(student.imgUrl || "");
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // MODAL SAVE
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Format phone numbers
      const formattedPhoneNumber = formatPhoneNumber(values.phoneNumber);
      const formattedParentPhone = values.parentPhone
        ? formatPhoneNumber(values.parentPhone)
        : undefined;

      // Use uploaded image URL or manual input, default to empty string
      const finalImageUrl = uploadedImageUrl || values.imgUrl || "";

      if (editingStudent) {
        // UPDATE - API expects: id, fullName, phone, imgUrl
        const updateData = {
          id: editingStudent.id,
          fullName: values.fulName,
          phone: formattedPhoneNumber,
          imgUrl: finalImageUrl,
        };

        updateStudent(updateData);
      } else {
        // CREATE - API expects: fullName, phone, imgUrl, password, groupId, parentPhone, parentName
        const createData = {
          fullName: values.fulName,
          phone: formattedPhoneNumber,
          imgUrl: finalImageUrl,
          password: values.password,
          groupId: Number(values.groupId),
          parentPhone: formattedParentPhone!,
          parentName: values.parentName,
        };

        createStudent(createData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setUploadedImageUrl("");
    } catch (err) {
      console.error("Form validation error:", err);
    }
  };

  // DELETE HANDLER
  const handleDelete = (studentId: number) => {
    deleteStudent(studentId);
  };

  // FILE UPLOAD HANDLER
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: "image/jpeg,image/jpg,image/png",
    beforeUpload: async (file) => {
      const url = await uploadFile(file);
      if (url) {
        setUploadedImageUrl(url);
        form.setFieldValue("imgUrl", url);
      }
      return false;
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // if (loading) return <LoadingScreen />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      {/* HEADER */}
      <ListHeader
        title={t("studentsCount")}
        count={filteredStudents.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchStudent")}
        buttonText={t("addStudent")}
        onButtonClick={() => showModal()}
      />
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip={t("loading")} />
        </div>
      )}
      {/* TABLE */}
      <TableComponent<Student>
        data={filteredStudents}
        itemName={t("student")}
        searchKeys={["fulName", "groupName", "phoneNumber"]}
        columnsConfig={[
          {
            key: "student",
            title: t("student"),
            render: (record: Student) => (
              <div className="flex items-center gap-3">
                {record.imgUrl && (
                  <img
                    src={record.imgUrl}
                    alt={record.fulName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                {!record.imgUrl && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    {record.fulName.charAt(0).toUpperCase()}
                  </div>
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
            render: (record: Student) => record.groupName,
          },
          {
            key: "phone",
            title: t("phone"),
            render: (record: Student) => formatPhoneDisplay(record.phoneNumber),
          },
          {
            key: "actions",
            title: t("actions"),
            render: (record: Student) => (
              <div className="flex justify-end gap-3">
                {/* EDIT BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(record);
                  }}
                  disabled={isUpdating}
                >
                  <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-700 transition-colors" />
                </button>

                {/* DELETE BUTTON */}
                <Popconfirm
                  title={`${t("student")}${t("confirmDeleteSuffix")}`}
                  description={`${record.fulName} o'chirilsinmi?`}
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDelete(record.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText={t("yes")}
                  cancelText={t("no")}
                  okButtonProps={{ loading: isDeleting }}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDeleting}
                  >
                    <TrashBinIcon className="w-5 h-5 text-red-600 hover:text-red-700 transition-colors" />
                  </button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      {/* MODAL */}
      <ModalComponent
        open={isModalVisible}
        title={editingStudent ? t("editStudent") : t("addStudent")}
        onOk={handleOk}
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
          {/* FULL NAME */}
          <Form.Item
            name="fulName"
            label={t("full_name")}
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* PHONE NUMBER */}
          <Form.Item
            name="phoneNumber"
            label={t("phone")}
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                validator: (_, value) => {
                  const formatted = formatPhoneNumber(value || "");
                  if (formatted.length === 12 && formatted.startsWith("998")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Phone must be 12 digits starting with 998"),
                  );
                },
              },
            ]}
          >
            <Input
              placeholder="+998 90-123-45-67"
              onChange={(e) => {
                const formatted = formatPhoneDisplay(e.target.value);
                form.setFieldValue("phoneNumber", formatted);
              }}
            />
          </Form.Item>

          {/* GROUP SELECT */}
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
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={groups.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
            />
          </Form.Item>

          {/* IMAGE UPLOAD */}
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

          {/* MANUAL IMAGE URL INPUT (Optional) */}
          <Form.Item name="imgUrl" label="Yoki URL kiriting">
            <Input
              placeholder="https://example.com/image.jpg"
              disabled={isUploading}
              onChange={(e) => {
                setUploadedImageUrl(e.target.value);
              }}
            />
          </Form.Item>

          {/* CREATE-ONLY FIELDS */}
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
                  {
                    validator: (_, value) => {
                      const formatted = formatPhoneNumber(value || "");
                      if (
                        formatted.length === 12 &&
                        formatted.startsWith("998")
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Phone must be 12 digits starting with 998"),
                      );
                    },
                  },
                ]}
              >
                <Input
                  placeholder="+998 90-123-45-67"
                  onChange={(e) => {
                    const formatted = formatPhoneDisplay(e.target.value);
                    form.setFieldValue("parentPhone", formatted);
                  }}
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
