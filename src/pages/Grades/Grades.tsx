// pages/Grades/Grades.tsx

import { useState } from "react";
import { Spin, Tag, Badge } from "antd";
import {
  TrophyOutlined,
  UserOutlined,
  StarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  BookOutlined,
} from "@ant-design/icons";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useMarks } from "../../hooks/useMark";
import { Mark, MarkCategoryStatus, MarkStatus } from "../../types/marks";
import NotFoundData from "../OtherPage/NotFoundData";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import InputComponent from "../../components/Input/Input";
import { InputNumber, Select } from "antd";

const Grades = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form] = FormWrapper.useForm();

  const {
    marks,
    loading,
    pagination,
    createMark,
    updateMark,
    deleteMark,
    isCreating,
    isUpdating,
  } = useMarks({ keyword: searchTerm, page: currentPage, size: pageSize });

  // Helper functions
  const getMarkStatusBadge = (status: MarkStatus) => {
    const statusConfig = {
      KUNLIK_BAHO: {
        color: "blue",
        icon: <BookOutlined />,
        text: "Kunlik",
      },
      IMTIHON_BAHO: {
        color: "purple",
        icon: <TrophyOutlined />,
        text: "Imtihon",
      },
      YAKUNIY_BAHO: {
        color: "gold",
        icon: <StarOutlined />,
        text: "Yakuniy",
      },
    };

    const config = statusConfig[status] || statusConfig.KUNLIK_BAHO;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getCategoryStatusColor = (status: MarkCategoryStatus) => {
    const colorMap = {
      YASHIL: "#52c41a", // Green
      SARIQ: "#faad14", // Yellow
      QIZIL: "#ff4d4f", // Red
    };
    return colorMap[status] || colorMap.YASHIL;
  };

  const getCategoryStatusText = (status: MarkCategoryStatus) => {
    const textMap = {
      YASHIL: "A'lo",
      SARIQ: "Yaxshi",
      QIZIL: "Qoniqarsiz",
    };
    return textMap[status] || status;
  };

  // Modal functions
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingMark(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (mark: Mark) => {
    setIsEditMode(true);
    setEditingMark(mark);
    form.setFieldsValue({
      studentId: mark.studentId,
      totalScore: mark.totalScore,
      activityScore: mark.activityScore,
      homeworkScore: mark.homeworkScore,
      markCategoryStatus: mark.markCategoryStatus,
      markStatus: mark.markStatus,
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode && editingMark) {
        updateMark(
          {
            markId: editingMark.markId,
            studentId: values.studentId,
            totalScore: values.totalScore,
            activityScore: values.activityScore,
            homeworkScore: values.homeworkScore,
            markCategoryStatus: values.markCategoryStatus,
            markStatus: values.markStatus,
          },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMark(
          {
            studentId: values.studentId,
            totalScore: values.totalScore,
            activityScore: values.activityScore,
            homeworkScore: values.homeworkScore,
            markCategoryStatus: values.markCategoryStatus,
            markStatus: values.markStatus,
          },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              form.resetFields();
            },
          }
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleDelete = (id: number) => {
    deleteMark(id);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title="Baholar soni"
        count={pagination.totalElements}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="O'quvchi qidirish..."
        buttonText="Baho qo'shish"
        onButtonClick={openAddModal}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : marks.length === 0 ? (
        <NotFoundData
          title="Baholar topilmadi"
          description="Hozircha hech qanday baho qo'shilmagan"
        />
      ) : (
        <div className="mt-6">
          <TableComponent<Mark>
            data={marks}
            itemName="baholar"
            searchKeys={["studentName"]}
            columnsConfig={[
              {
                key: "student",
                title: "O'quvchi",
                render: (record) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      <UserOutlined />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {record.studentName}
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                key: "scores",
                title: "Ballar",
                render: (record) => (
                  <div className="flex gap-2">
                    <Badge
                      count={record.totalScore}
                      style={{
                        backgroundColor: getCategoryStatusColor(
                          record.markCategoryStatus
                        ),
                      }}
                      className="px-3 py-1"
                    >
                      <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          Umumiy
                        </span>
                      </div>
                    </Badge>
                    <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-1">
                        <FireOutlined className="text-blue-600 dark:text-blue-400 text-xs" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Faollik:
                        </span>
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {record.activityScore}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-1">
                        <BookOutlined className="text-purple-600 dark:text-purple-400 text-xs" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Uy ishi:
                        </span>
                        <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                          {record.homeworkScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "status",
                title: "Holat",
                render: (record) => (
                  <div className="flex flex-col gap-2">
                    {getMarkStatusBadge(record.markStatus)}
                    <Tag
                      color={getCategoryStatusColor(record.markCategoryStatus)}
                      icon={<CheckCircleOutlined />}
                    >
                      {getCategoryStatusText(record.markCategoryStatus)}
                    </Tag>
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
              showTotal: (total) => `Jami: ${total} ta baho`,
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
              <TrophyOutlined className="text-white text-sm" />
            </div>
            <span>
              {editingMark ? "Bahoni tahrirlash" : "Yangi baho qo'shish"}
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
        confirmLoading={isCreating || isUpdating}
      >
        <FormWrapper form={form} layout="vertical">
          <FormWrapper.Item
            name="studentId"
            label="O'quvchi ID"
            rules={[{ required: true, message: "O'quvchi ID ni kiriting" }]}
          >
            <InputNumber
              className="w-full"
              placeholder="32"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </FormWrapper.Item>

          <div className="grid grid-cols-3 gap-4">
            <FormWrapper.Item
              name="totalScore"
              label="Umumiy ball"
              rules={[
                { required: true, message: "Umumiy ballni kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="10"
              />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="activityScore"
              label="Faollik bali"
              rules={[
                { required: true, message: "Faollik balini kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
              />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="homeworkScore"
              label="Uy ishi bali"
              rules={[
                { required: true, message: "Uy ishi balini kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
              />
            </FormWrapper.Item>
          </div>

          <FormWrapper.Item
            name="markStatus"
            label="Baho turi"
            rules={[{ required: true, message: "Baho turini tanlang" }]}
          >
            <Select placeholder="Baho turini tanlang">
              <Select.Option value="KUNLIK_BAHO">
                <BookOutlined /> Kunlik baho
              </Select.Option>
              <Select.Option value="IMTIHON_BAHO">
                <TrophyOutlined /> Imtihon bahosi
              </Select.Option>
            </Select>
          </FormWrapper.Item>

          <FormWrapper.Item
            name="markCategoryStatus"
            label="Baho darajasi"
            rules={[{ required: true, message: "Baho darajasini tanlang" }]}
          >
            <Select placeholder="Baho darajasini tanlang">
              <Select.Option value="YASHIL">
                <Tag color="green">A'lo</Tag>
              </Select.Option>
              <Select.Option value="SARIQ">
                <Tag color="yellow">Yaxshi</Tag>
              </Select.Option>
              <Select.Option value="QIZIL">
                <Tag color="red">Qoniqarsiz</Tag>
              </Select.Option>
            </Select>
          </FormWrapper.Item>
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default Grades;