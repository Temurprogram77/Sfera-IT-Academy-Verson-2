import { useState, useMemo } from "react";
import {
  Image,
  DatePicker,
  Spin,
  Card,
  Modal,
  Tag,
  Button,
  Popconfirm,
  Form,
} from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
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
import img from "../../../public/news.jpg";

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

  const userRole = useMemo(() => localStorage.getItem("user_role"), []);
  const canManageNews =
    userRole === "ROLE_ADMIN" || userRole === "ROLE_SUPER_ADMIN";

  const titleValue = Form.useWatch("title", form);
  const descriptionValue = Form.useWatch("description", form);
  const isSaveDisabled = !titleValue?.trim() || !descriptionValue?.trim();

  const openAddModal = () => {
    if (!canManageNews) return;
    setEditingNews(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (item: NewsItem) => {
    if (!canManageNews) return;
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
    if (!canManageNews || isSaveDisabled) return;

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
  };

  const handleDelete = (id: number) => {
    if (!canManageNews) return;
    deleteNews(id);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl min-h-screen">
      <ListHeader
        title="Yangiliklar soni"
        count={total}
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(0);
        }}
        searchPlaceholder="Yangilik qidirish..."
        buttonText={canManageNews ? "Yangilik qo'shish" : undefined}
        onButtonClick={canManageNews ? openAddModal : undefined}
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
                <div className="h-52 overflow-hidden">
                  <img
                    src={item.imgUrl || img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              }
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="primary"
                  ghost
                  icon={<EyeOutlined />}
                  onClick={() => openViewModal(item)}
                  className="flex-1"
                  size="small"
                >
                  Ko'rish
                </Button>

                {canManageNews && (
                  <>
                    <Button
                      type="primary"
                      ghost
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(item)}
                      className="flex-1"
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
                        className="flex-1"
                        size="small"
                      >
                        O'chirish
                      </Button>
                    </Popconfirm>
                  </>
                )}
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
            <Image
              src={viewingNews.imgUrl || img}
              alt={viewingNews.title}
              className="w-full rounded-xl"
              style={{ maxHeight: 350, objectFit: "cover" }}
              preview={false}
            />
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
        okButtonProps={{ disabled: isSaveDisabled }}
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
