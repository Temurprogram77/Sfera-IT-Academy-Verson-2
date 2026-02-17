import { useState } from "react";
import { Image, DatePicker, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import NotFoundData from "../OtherPage/NotFoundData";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import FileUpload from "../../components/Input/FileUpload";
import TableComponent from "../../components/Table/Table";

import { NewsItem } from "../../types/news";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useNews } from "../../hooks/useNews";

const News = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // ✅ TableComponent faqat (item) kutadi
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

  // ✅ TableComponent faqat (id) kutadi
  const handleDelete = (id: number) => {
    deleteNews(id);
  };

  // ✅ handlePageChange qaytarildi
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
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
        <div className="mt-6">
          <TableComponent<NewsItem>
            data={news}
            itemName="yangiliklar"
            searchKeys={["title", "description"]}
            viewPath={(id) => `/news/${id}`}
            columnsConfig={[
              {
                key: "news",
                title: "Yangilik",
                render: (record) => (
                  <div className="flex items-center gap-4">
                    {record.imgUrl ? (
                      <Image
                        src={record.imgUrl}
                        width={64}
                        height={64}
                        className="rounded-[6px] object-cover border shadow"
                      />
                    ) : (
                      <div className="w-[64px] h-[64px] rounded-full bg-[#00a67d] flex items-center justify-center text-white text-xl font-bold">
                        {record.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-900 dark:text-white text-base">
                        {record.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {record.description}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "date",
                title: "Sana",
                dataIndex: "date",
                width: 180,
                align: "center",
                render: (date: string) => (
                  <div className="text-sm font-medium">{date}</div>
                ),
              },
            ]}
            onEdit={openEditModal}
            onDelete={handleDelete}
            pagination={{
              current: currentPage + 1,
              pageSize,
              total,
              onChange: handlePageChange,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `Jami: ${total} ta yangilik`,
            }}
          />
        </div>
      )}

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
            <InputComponent variant="textarea" placeholder="Tavsif..." />
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