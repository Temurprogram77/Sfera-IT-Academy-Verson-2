import { useState } from "react";
import { Image, DatePicker, Spin, Card, Modal, Tag, Button, Popconfirm } from "antd";
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
import { Form } from "antd";

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

const titleValue = Form.useWatch("title", form);
const descriptionValue = Form.useWatch("description", form);

const isSaveDisabled = !titleValue?.trim() || !descriptionValue?.trim();
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
    if (isSaveDisabled) return;
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
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl min-h-screen">
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              cover={
                item.imgUrl ? (
                  <div className="h-52 overflow-hidden">
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-52 bg-gradient-to-br from-[#00a67d] to-[#007a5c] flex flex-col items-center justify-center gap-2">
                    <FileTextOutlined className="text-white text-5xl" />
                    <span className="text-white text-sm font-medium opacity-80">
                      Rasm mavjud emas
                    </span>
                  </div>
                )
              }
              // actions o'rniga o'zimiz quramiz
              actions={undefined}
            >
              <div className="flex flex-col gap-2">
                {item.date && (
                  <Tag
                    icon={<CalendarOutlined />}
                    color="green"
                    className="w-fit text-xs"
                  >
                    {item.date}
                  </Tag>
                )}
                <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Custom action tugmalar */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="primary"
                  ghost
                  icon={<EyeOutlined />}
                  onClick={() => openViewModal(item)}
                  className="flex-1 !border-blue-400 !text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900/20 dark:!border-blue-500 dark:!text-blue-400"
                  size="small"
                >
                  Ko'rish
                </Button>

                <Button
                  type="primary"
                  ghost
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(item)}
                  className="flex-1 !border-green-400 !text-green-600 hover:!bg-green-50 dark:hover:!bg-green-900/20 dark:!border-green-500 dark:!text-green-400"
                  size="small"
                >
                  Tahrirlash
                </Button>

                <Popconfirm
                  title="Yangilikni o'chirish"
                  description="Rostdan ham o'chirmoqchimisiz?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Ha"
                  cancelText="Yo'q"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    ghost
                    icon={<DeleteOutlined />}
                    className="flex-1 dark:!border-red-500 dark:!text-red-400 dark:hover:!bg-red-900/20"
                    size="small"
                  >
                    O'chirish
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 👁 View Modal */}
      <Modal
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={600}
        centered
        className="dark:[&_.ant-modal-content]:bg-gray-800 dark:[&_.ant-modal-header]:bg-gray-800 dark:[&_.ant-modal-title]:text-white dark:[&_.ant-modal-close]:text-gray-400"
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
                className="w-full rounded-xl"
                style={{ maxHeight: 350, objectFit: "cover" }}
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
          <span className="dark:text-white">
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
        okButtonProps={{
          disabled: isSaveDisabled,
        }}
      >
        <FormWrapper
          form={form}
          layout="vertical"
        >
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