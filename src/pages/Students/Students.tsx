import { useState } from "react";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import { Image, Spin } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useStudents } from "../../hooks/useStudent";
import { useGroups } from "../../hooks/useGroups";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Student } from "../../types/student";
import NotFoundData from "../OtherPage/NotFoundData";
import FileUpload from "../../components/Input/FileUpload";
import { formatPhoneDisplay } from "../../utils/phone";
import PhoneInput from "../../components/Input/PhoneInput";
import SelectComponent from "../../components/Select/Select";

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

  const [form] = FormWrapper.useForm();

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
        updateStudent(
          {
            id: editingStudent.id,
            fullName: values.fullName,
            phone: normalizePhone(values.phoneNumber),
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
            phone: normalizePhone(values.phoneNumber),
            password: values.password,
            parentPhone: normalizePhone(values.parentPhone),
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

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      <ListHeader
        title={t("studentsCount")}
        count={pagination.totalElements}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("searchStudent")}
        buttonText={t("addStudent")}
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : students.length === 0 ? (
        <NotFoundData
          title="O'quvchilar topilmadi"
          description="Hozircha hech qanday o'quvchi qo'shilmagan"
        />
      ) : (
        <TableComponent<Student>
          data={students}
          itemName={t("student")}
          searchKeys={["fulName", "groupName", "phoneNumber"]}
          viewPath={(id) => `/students/${id}`}
          columnsConfig={[
            {
              key: "student",
              title: t("student"),
              render: (record) => (
                <div className="flex items-center gap-3">
                  {record.imgUrl ? (
                    <Image
                      src={record.imgUrl}
                      width={40}
                      height={40}
                      preview={{
                        mask: "Ko‘rish",
                      }}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
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
              render: (record) => record.groupName,
            },
            {
              key: "phone",
              title: t("phone"),
              render: (record) => formatPhoneDisplay(record.phoneNumber),
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
          onEdit={openEditModal}
          onDelete={handleDelete}
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
            name="phoneNumber"
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

          {!editingStudent && (
            <FormWrapper.Item
              name="groupId"
              label={t("group")}
              rules={[{ required: true, message: "Iltimos, guruhni tanlang" }]}
            >
              <SelectComponent
                placeholder="Guruhni tanlang"
                loading={groupsLoading}
                options={groups.map((g) => ({ value: g.id, label: g.name }))}
                // showSearch qo'shish xohlasang:
                // showSearch
              />
            </FormWrapper.Item>
          )}

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
              // isUploading={isUploading}
            />
          </FormWrapper.Item>

          {!editingStudent && (
            <FormWrapper.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <InputComponent variant="password" placeholder="Enter password" />
            </FormWrapper.Item>
          )}

          {!editingStudent && (
            <>
              <FormWrapper.Item
                name="parentName"
                label="Parent Name"
                rules={[
                  { required: true, message: "Please enter parent name" },
                ]}
              >
                <InputComponent placeholder="Enter parent name" />
              </FormWrapper.Item>
            </>
          )}
          <FormWrapper.Item
            name="parentPhone"
            label="Parent Phone"
            rules={[
              { required: true, message: "Please enter parent phone" },
              {
                pattern: /^998\d{9}$/,
                message: "To'g'ri formatda kiriting! (998XXXXXXXXX)",
              },
            ]}
          >
            <PhoneInput placeholder="+998 90 123 45 67" />
          </FormWrapper.Item>
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default Students;
