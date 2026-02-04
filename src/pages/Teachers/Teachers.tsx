import { useState } from "react";
import { Form, Spin } from "antd";
import { useTeacher } from "../../hooks/useTeacher";
import InputComponent from "../../components/InputComponent/InputComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ListHeader from "../../components/ListHeader/ListHeader";
import NotFoundData from "../OtherPage/NotFoundData";
import { Teacher as TeacherType } from "../../types/teacher";
import FileUpload from "../../components/InputComponent/FileUpload";
import { useFileUpload } from "../../hooks/useFileUpload";

const Teacher = () => {

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherType | null>(
    null,
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const { uploadFile, uploadProgress, isUploading } = useFileUpload();

  const {
    teachers,
    pagination,
    isLoading,
    createTeacher,
    isCreating,
    updateTeacher,
    isUpdating,
    deleteTeacher,
  } = useTeacher({
    name: search || undefined,
    page: currentPage,
    size: pageSize,
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingTeacher(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: TeacherType) => {
    setIsEditMode(true);
    setEditingTeacher(teacher);
    setUploadedImageUrl(teacher.imageUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      fullName: teacher.fullName,
      phone: teacher.phone,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && editingTeacher) {
        let finalImageUrl = uploadedImageUrl;

        if (selectedFile) {
          const uploadedUrl = await uploadFile(selectedFile);

          if (uploadedUrl) {
            finalImageUrl = uploadedUrl;
          } else {
            return;
          }
        }

        const teacherData = {
          id: editingTeacher.id,
          fullName: values.fullName,
          phone: values.phone.replace(/\s/g, ""),
          imageUrl: finalImageUrl || "",
        };

        updateTeacher(teacherData, {
          onSuccess: () => {
            setIsModalOpen(false);
            form.resetFields();
            setUploadedImageUrl("");
            setSelectedFile(null);
          },
        });
      } else {
        const teacherData = {
          fullName: values.fullName,
          phone: values.phone.replace(/\s/g, ""),
          password: values.password,
        };

        createTeacher(teacherData, {
          onSuccess: () => {
            setIsModalOpen(false);
            form.resetFields();
          },
        });
      }
    } catch (error) {
      console.error("❌ Validation error:", error);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  const handleDelete = (id: number) => {
    deleteTeacher(id);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title="O'qituvchilar"
        count={pagination.totalElements}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="O'qituvchi qidirish"
        buttonText="O'qituvchi qo'shish"
        onButtonClick={openAddModal}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Yuklanmoqda..." />
        </div>
      ) : teachers.length === 0 ? (
        <NotFoundData
          title="O'qituvchilar topilmadi"
          description="Hozircha hech qanday o'qituvchi qo'shilmagan"
        />
      ) : (
        <TableComponent<TeacherType>
          data={teachers}
          itemName="O'qituvchi"
          searchKeys={["fullName", "phone"]}
          columnsConfig={[
            {
              key: "fullName",
              title: "O'qituvchi",
              dataIndex: "fullName",
              render: (_: any, record: TeacherType) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {record.imageUrl && record.imageUrl.trim() !== "" ? (
                      <img
                        src={record.imageUrl}
                        alt={record.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      record.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {record.fullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {record.phone}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "phone",
              title: "Telefon",
              dataIndex: "phone",
              render: (phone: string) => (
                <span className="text-gray-700 dark:text-gray-300">
                  {phone}
                </span>
              ),
            },
            {
              key: "status",
              title: "Holat",
              dataIndex: "status",
              render: (status: string) => (
                <span className="px-3 py-1 text-xs rounded-full bg-[#03906d] text-white">
                  {status || "Faol"}
                </span>
              ),
            },
          ]}
          modalFields={[
            {
              name: "fullName",
              label: "To'liq ism",
              component: <InputComponent />,
              rules: [{ required: true }],
            },
          ]}
          pagination={{
            current: currentPage + 1,
            pageSize: pageSize,
            total: pagination.totalElements,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta o'qituvchi`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <ModalComponent
        open={isModalOpen}
        title={isEditMode ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setUploadedImageUrl("");
          setSelectedFile(null);
        }}
        confirmLoading={isCreating || isUpdating || isUploading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="To'liq ism"
            rules={[
              { required: true, message: "To'liq ismni kiriting!" },
              { min: 3, message: "Kamida 3 ta belgi bo'lishi kerak!" },
            ]}
          >
            <InputComponent placeholder="To'liq ismni kiriting" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon"
            rules={[
              { required: true, message: "Telefon raqamni kiriting!" },
              {
                pattern: /^998\d{9}$/,
                message: "To'g'ri formatda kiriting! (998XXXXXXXXX)",
              },
            ]}
          >
            <InputComponent placeholder="998681663648" />
          </Form.Item>

          {/* CREATE MODE - Faqat Password */}
          {!isEditMode && (
            <Form.Item
              name="password"
              label="Parol"
              rules={[
                { required: true, message: "Parolni kiriting!" },
                {
                  min: 6,
                  message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
                },
              ]}
            >
              <InputComponent type="password" placeholder="Parolni kiriting" />
            </Form.Item>
          )}

          {/* EDIT MODE - Faqat File Upload */}
          {isEditMode && (
            <Form.Item label="Rasm">
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
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Teacher;
