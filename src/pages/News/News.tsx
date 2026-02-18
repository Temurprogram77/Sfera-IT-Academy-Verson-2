import { useState } from "react";
import { Image, DatePicker, Spin, Card, Modal, Tag } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import NotFoundData from "../OtherPage/NotFoundData";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import FileUpload from "../../components/Input/FileUpload";

import { NewsItem } from "../../types/news";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useNews } from "../../hooks/useNews";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [viewingNews, setViewingNews] = useState<NewsItem | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const [form] = FormWrapper.useForm();
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const {
    news,
    total,
    loading,
    createNews,
    updateNews,
    deleteNews,
    isCreating,
    isUpdating,
  } = useNews({ page: currentPage, size: pageSize, search: searchTerm });

  const openAddModal = () => {
    setEditingNews(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingNews(item);
    setUploadedImageUrl(item.imgUrl || "");
    setSelectedFile(null);
    form.setFieldsValue({
      title: item.title,
      description: item.description,
      date: item.date ? dayjs(item.date) : null,
    });
    setIsModalVisible(true);
  };

  const openViewModal = (item: NewsItem) => {
    setViewingNews(item);
    setIsViewModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let finalImageUrl = uploadedImageUrl;

      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = {
        title: values.title,
        description: values.description,
        imgUrl: finalImageUrl || "",
        date: values.date?.format("YYYY-MM-DD"),
      };

      if (editingNews) {
        updateNews({ id: editingNews.id, ...payload });
      } else {
        createNews(payload);
      }

      setIsModalVisible(false);
      form.resetFields();
      setUploadedImageUrl("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Validation error:", err);
    }
  };

  const handleDelete = (id: number) => {
    deleteNews(id);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title="Yangiliklar soni"
        count={total}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Yangilik qidirish..."
        buttonText="Yangilik qo'shish"
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : news.length === 0 ? (
        <NotFoundData
          title="Yangiliklar topilmadi"
          description="Hozircha hech qanday yangilik qo'shilmagan"
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
          {news.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
              cover={
                item.imgUrl ? (
                  <div className="h-70 overflow-hidden">
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="w-full h-full bg-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-70 bg-gradient-to-br from-[#00a67d] to-[#007a5c] flex flex-col items-center justify-center gap-2">
                    <FileTextOutlined className="text-white text-5xl" />
                    <span className="text-white text-sm font-medium opacity-80">
                      Rasm mavjud emas
                    </span>
                  </div>
                )
              }
              actions={[
                <EyeOutlined
                  key="view"
                  className="text-blue-500 hover:text-blue-700 text-base"
                  onClick={() => openViewModal(item)}
                />,
                <EditOutlined
                  key="edit"
                  className="text-green-500 hover:text-green-700 text-base"
                  onClick={() => openEditModal(item)}
                />,
                <DeleteOutlined
                  key="delete"
                  className="text-red-400 hover:text-red-600 text-base"
                  onClick={() => handleDelete(item.id)}
                />,
              ]}
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={600}
        centered
        title={
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {viewingNews?.title}
          </span>
        }
      >
        {viewingNews && (
          <div className="flex flex-col gap-4 pt-2">
            {viewingNews.imgUrl && (
              <Image
                src={viewingNews.imgUrl}
                alt={viewingNews.title}
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: 470, objectFit: "cover" }}
                preview={false}
              />
            )}
            {viewingNews.date && (
              <Tag icon={<CalendarOutlined />} color="green" className="w-fit">
                {viewingNews.date}
              </Tag>
            )}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {viewingNews.description}
            </p>
          </div>
        )}
      </Modal>
      <ModalComponent
        open={isModalVisible}
        title={
          <span>
            {editingNews ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}
          </span>
        }
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={isUploading || isCreating || isUpdating}
      >
        <FormWrapper form={form} layout="vertical">
          <FormWrapper.Item
            name="title"
            label="Yangilik nomi"
            rules={[{ required: true, message: "Nomni kiriting" }]}
          >
            <InputComponent placeholder="Yangilik sarlavhasi..." />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: "Tavsif kiriting" }]}
          >
            <InputComponent
              variant="textarea"
              max={255}
              placeholder="Tavsif..."
            />
          </FormWrapper.Item>

          <FormWrapper.Item name="date" label="Sana">
            <DatePicker className="w-full" />
          </FormWrapper.Item>

          <FormWrapper.Item label="Yangilik rasmi">
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

export default News;
