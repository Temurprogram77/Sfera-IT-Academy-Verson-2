import { useState } from "react";
import { Spin, Tag, Form, InputNumber, Select } from "antd";
import {
  TrophyOutlined,
  StarOutlined,
  BookOutlined,
} from "@ant-design/icons";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useMark } from "../../hooks/useMyMarks";
import { Mark, MarkCategoryStatus, MarkStatus } from "../../types/mark";
import NotFoundData from "../OtherPage/NotFoundData";

const Grades = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [markStatus, setMarkStatus] = useState<string | null>(null);

  const [form] = Form.useForm();

  const { marks, loading, pagination, updateMark, deleteMark, isUpdating } =
    useMark({ keyword: searchTerm, page: currentPage, size: pageSize });

  const getMarkStatusBadge = (status: MarkStatus) => {
    const statusConfig = {
      KUNLIK_BAHO: { color: "blue", icon: <BookOutlined />, text: "Kunlik" },
      IMTIHON_BAHO: { color: "purple", icon: <TrophyOutlined />, text: "Imtihon" },
      YAKUNIY_BAHO: { color: "gold", icon: <StarOutlined />, text: "Yakuniy" },
    };
    const config = statusConfig[status] || statusConfig.KUNLIK_BAHO;
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
  };

  const getCategoryStatusColor = (status: MarkCategoryStatus) => {
    const colorMap = { YASHIL: "#52c41a", SARIQ: "#faad14", QIZIL: "#ff4d4f" };
    return colorMap[status] || colorMap.YASHIL;
  };

  const getCategoryStatusText = (status: MarkCategoryStatus) => {
    const textMap = { YASHIL: "A'lo", SARIQ: "Yaxshi", QIZIL: "Qoniqarsiz" };
    return textMap[status] || status;
  };

  const openEditModal = (mark: Mark) => {
    setEditingMark(mark);
    setMarkStatus(mark.markStatus);
    form.setFieldsValue({
      totalScore: mark.totalScore,
      activityScore: mark.activityScore,
      homeworkScore: mark.homeworkScore,
      markStatus: mark.markStatus,
    });
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setMarkStatus(null);
    setEditingMark(null);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editingMark) {
      updateMark(
        {
          markId: editingMark.markId,
          studentId: editingMark.studentId,
          totalScore: values.totalScore,
          activityScore: values.activityScore,
          homeworkScore: values.homeworkScore,
          markStatus: values.markStatus,
        },
        { onSuccess: handleClose },
      );
    }
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title="Baholar soni"
        count={pagination.totalElements}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="O'quvchi qidirish..."
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
            columnsConfig={[
              {
                key: "student",
                title: "O'quvchi",
                render: (record) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      <UserOutlined />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {record.studentName}
                    </span>
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
                      style={{ backgroundColor: getCategoryStatusColor(record.markCategoryStatus) }}
                    >
                      <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Umumiy</span>
                      </div>
                    </Badge>
                    <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-1">
                        <FireOutlined className="text-blue-600 text-xs" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Faollik:</span>
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {record.activityScore}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-1">
                        <BookOutlined className="text-purple-600 text-xs" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Uy ishi:</span>
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
            onDelete={(id) => deleteMark(id)}
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
            <span>Bahoni tahrirlash</span>
          </div>
        }
        onOk={handleSave}
        onCancel={handleClose}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="markStatus" label="Baho turi">
            <Select disabled>
              <Select.Option value="KUNLIK_BAHO">
                <BookOutlined /> Kunlik baho
              </Select.Option>
              <Select.Option value="IMTIHON_BAHO">
                <TrophyOutlined /> Imtihon bahosi
              </Select.Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="totalScore"
              label="Umumiy ball"
              rules={[
                { required: markStatus === "IMTIHON_BAHO", message: "Umumiy ballni kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0} max={100} className="w-full" placeholder="0"
                disabled={markStatus !== "IMTIHON_BAHO"}
              />
            </Form.Item>

            <Form.Item
              name="activityScore"
              label="Faollik bali"
              rules={[
                { required: markStatus === "KUNLIK_BAHO", message: "Faollik balini kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0} max={100} className="w-full" placeholder="0"
                disabled={markStatus !== "KUNLIK_BAHO"}
              />
            </Form.Item>

            <Form.Item
              name="homeworkScore"
              label="Uy ishi bali"
              rules={[
                { required: markStatus === "KUNLIK_BAHO", message: "Uy ishi balini kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0} max={100} className="w-full" placeholder="0"
                disabled={markStatus !== "KUNLIK_BAHO"}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Grades;