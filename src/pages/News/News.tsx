import { useState, useEffect } from "react";
import { Image, DatePicker, Spin } from "antd";
import dayjs from "dayjs";

import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import NotFoundData from "../OtherPage/NotFoundData";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import FileUpload from "../../components/Input/FileUpload";

import { newsService } from "../../services/newsService";
import { NewsItem } from "../../types/news";
import { useFileUpload } from "../../hooks/useFileUpload";

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form] = FormWrapper.useForm();
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await newsService.getNews({
        page: currentPage,
        size: pageSize,
        search: searchTerm,
      });

      setNews(res.data);
      setTotal(res.data.length);
    } catch (err) {
      console.error("Fetch news error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, pageSize, searchTerm]);

  const openAddModal = () => {
    setEditingNews(null);
    setUploadedImageUrl("");
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = async (item: NewsItem) => {
    try {
      const res = await newsService.getNewsById(item.id);
      const data = res.data;

      setEditingNews(data);
      setUploadedImageUrl(data.imgUrl || "");
      setSelectedFile(null);

      form.setFieldsValue({
        name: data.title,
        description: data.description,
        date: data.date ? dayjs(data.date) : null,
      });

      setIsModalVisible(true);
    } catch (err) {
      console.error(err);
    }
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
        await newsService.updateNews({
          id: editingNews.id,
          ...payload,
        });
      } else {
        await newsService.createNews(payload);
      }

      setIsModalVisible(false);
      form.resetFields();
      setUploadedImageUrl("");
      setSelectedFile(null);
      fetchNews();
    } catch (err) {
      console.error("Validation error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await newsService.deleteNews(id);
    fetchNews();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };
  console.log(news);
  
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
                        className=" rounded-[6px] object-cover border shadow"
                      />
                    ) : (
                      <div className="w-[64px] h-[64px] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        {record.title}
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
                width: 200,
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
          <div className="flex items-center gap-2">
            <span>
              {editingNews
                ? "Yangilikni tahrirlash"
                : "Yangi yangilik qo'shish"}
            </span>
          </div>
        }
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={isUploading}
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
