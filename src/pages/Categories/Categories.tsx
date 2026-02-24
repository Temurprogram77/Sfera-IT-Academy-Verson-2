// pages/Categories/Categories.tsx

import { useState } from "react";
import { Image, InputNumber, Spin } from "antd";
import {
  AppstoreOutlined,
  ReadOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useCategories } from "../../hooks/useCategory";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Category } from "../../types/category";
import NotFoundData from "../OtherPage/NotFoundData";
import FileUpload from "../../components/Input/FileUpload";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = FormWrapper.useForm();

  const {
    categories,
    loading,
    pagination,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
  } = useCategories({ name: searchTerm, page: currentPage, size: pageSize });

  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  // Modal functions
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingCategory(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditMode(true);
    setEditingCategory(category);
    setUploadedImageUrl(category?.imgUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      duration: category.duration,
      questionLimit: category.questionLimit,
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

      if (isEditMode && editingCategory) {
        updateCategory(
          {
            id: editingCategory.id,
            name: values.name,
            description: values.description,
            duration: values.duration,
            questionLimit: values.questionLimit,
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
        createCategory(
          {
            name: values.name,
            description: values.description,
            duration: values.duration,
            questionLimit: values.questionLimit,
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
    deleteCategory(id);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title="Kategoriyalar soni"
        count={pagination.totalElements}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Kategoriya qidirish..."
        buttonText="Kategoriya qo'shish"
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : categories.length === 0 ? (
        <NotFoundData
          title="Kategoriyalar topilmadi"
          description="Hozircha hech qanday kategoriya qo'shilmagan"
        />
      ) : (
        <div className="mt-6">
          <TableComponent<Category>
            data={categories}
            itemName="kategoriyalar"
            searchKeys={["name", "description"]}
            viewPath={(id) => `/categories/${id}`}
            columnsConfig={[
              {
                key: "category",
                title: "Kategoriya",
                render: (record) => (
                  <div className="flex items-center gap-4">
                    {record.imgUrl ? (
                      <div className="relative group">
                        <Image
                          src={record.imgUrl}
                          width={56}
                          height={56}
                          preview={{ mask: "Ko'rish" }}
                          className="rounded-xl object-cover border-2 border-blue-100 dark:border-blue-900 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl opacity-0 " />
                      </div>
                    ) : (
                      <div className="w-[56px] h-[56px] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {record.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                        {record.name}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <ReadOutlined className="w-3 h-3 mr-1" />
                          Kurs
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {record.description.length > 30
                          ? record.description.slice(0, 70) + "..."
                          : record.description}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "details",
                title: "Tafsilotlar",
                render: (record) => (
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <ClockCircleOutlined className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Davomiyligi
                        </span>
                        <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                          {record.duration} oy
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <QuestionCircleOutlined className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />

                      <div className="flex flex-col">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Savollar soni
                        </span>
                        <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                          {record.questionLimit} ta
                        </span>
                      </div>
                    </div>
                  </div>
                ),
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
              showTotal: (total) => `Jami: ${total} ta kategoriya`,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
          />
        </div>
      )}

      <ModalComponent
        open={isModalVisible}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <AppstoreOutlined className="text-white text-sm" />
            </div>
            <span>
              {editingCategory
                ? "Kategoriyani tahrirlash"
                : "Yangi kategoriya qo'shish"}
            </span>
          </div>
        }
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setUploadedImageUrl("");
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={isCreating || isUpdating || isUploading}
      >
        <FormWrapper form={form} layout="vertical">
          <FormWrapper.Item
            name="name"
            label="Kategoriya nomi"
            rules={[{ required: true, message: "Kategoriya nomini kiriting" }]}
          >
            <InputComponent placeholder="Masalan: Frontend Development" />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: "Tavsifni kiriting" }]}
          >
            <InputComponent
              variant="textarea"
              placeholder="Kategoriya haqida qisqacha ma'lumot..."
            />
          </FormWrapper.Item>

          <div className="grid grid-cols-2 gap-4">
            <FormWrapper.Item
              name="duration"
              label="Davomiyligi (oy)"
              rules={[
                { required: true, message: "Davomiyligini kiriting" },
                {
                  type: "number",
                  min: 1,
                  message: "Davomiyligi 1 oydan kam bo'lmasligi kerak",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder={"1"}
                className="w-full"
                prefix={<ClockCircleOutlined className="text-gray-400" />}
              />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="questionLimit"
              label="Savollar soni"
              rules={[
                { required: true, message: "Savollar sonini kiriting" },
                {
                  type: "number",
                  min: 1,
                  message: "Savollar soni 1 tadan kam bo'lmasligi kerak",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder={"20"}
                className="w-full"
                prefix={<QuestionCircleOutlined className="text-gray-400" />}
              />
            </FormWrapper.Item>
          </div>

          <FormWrapper.Item label="Kategoriya rasmi">
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
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default Categories;
