// src/components/StudentMarksSection/StudentMarksSection.tsx
import { useState } from "react";
import {
  Tag,
  Badge,
  Input,
  Spin,
  Empty,
  Popconfirm,
  Avatar,
  Form,
  InputNumber,
  Select,
  Pagination,
} from "antd";
import {
  BookOutlined,
  FireOutlined,
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ModalComponent from "../Modal/Modal";
import { useMarksByGroup } from "../../hooks/useMarksByGroup";
import { useMark } from "../../hooks/useMark";
import { Mark, MarkCategoryStatus, MarkStatus, UpdateMarkDto, CreateMarkDto } from "../../types/mark";

const PRIMARY_COLOR = "#00A67D";

interface StudentMarksSectionProps {
  groupId: number;
  students: Array<{ studentId?: number; id?: number; fulName?: string; fullName?: string; imageUrl?: string }>;
}

const getMarkStatusConfig = (status: MarkStatus) => {
  const config = {
    KUNLIK_BAHO: { color: "blue", icon: <BookOutlined />, text: "Kunlik" },
    IMTIHON_BAHO: { color: "purple", icon: <TrophyOutlined />, text: "Imtihon" },
  };
  return config[status] || config.KUNLIK_BAHO;
};

const getCategoryColor = (status: MarkCategoryStatus) => {
  const map = { YASHIL: "#52c41a", SARIQ: "#faad14", QIZIL: "#ff4d4f" };
  return map[status] || map.YASHIL;
};

const getCategoryText = (status: MarkCategoryStatus) => {
  const map = { YASHIL: "A'lo", SARIQ: "Yaxshi", QIZIL: "Qoniqarsiz" };
  return map[status] || status;
};

const StudentMarksSection = ({ groupId, students }: StudentMarksSectionProps) => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [markStatus, setMarkStatus] = useState<MarkStatus>("KUNLIK_BAHO");

  const [form] = Form.useForm();

  const { marks, pagination, loading, refetch } = useMarksByGroup({
    groupId,
    keyword,
    page,
    size: pageSize,
  });

  const { updateMark, isUpdating, createMark, isCreating, deleteMark } = useMark();

  // ─── Open Edit Modal ──────────────────────────────────────────
  const openEditModal = (mark: Mark) => {
    setIsAddMode(false);
    setEditingMark(mark);
    setMarkStatus(mark.markStatus);
    form.setFieldsValue({
      studentId: mark.studentId,
      markStatus: mark.markStatus,
      totalScore: mark.totalScore,
      activityScore: mark.activityScore,
      homeworkScore: mark.homeworkScore,
    });
    setIsModalVisible(true);
  };

  // ─── Open Add Modal ───────────────────────────────────────────
  const openAddModal = () => {
    setIsAddMode(true);
    setEditingMark(null);
    setMarkStatus("KUNLIK_BAHO");
    form.resetFields();
    form.setFieldsValue({ markStatus: "KUNLIK_BAHO" });
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingMark(null);
  };

  const handleMarkStatusChange = (val: MarkStatus) => {
    setMarkStatus(val);
    // Reset score fields when switching type
    form.setFieldsValue({ totalScore: 0, activityScore: 0, homeworkScore: 0 });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const today = new Date().toISOString().split("T")[0];

      if (isAddMode) {
        const dto: CreateMarkDto = {
          studentId: values.studentId,
          markStatus: values.markStatus,
          date: today,
          totalScore: values.markStatus === "IMTIHON_BAHO" ? values.totalScore : 0,
          activityScore: values.markStatus === "KUNLIK_BAHO" ? values.activityScore : 0,
          homeworkScore: values.markStatus === "KUNLIK_BAHO" ? values.homeworkScore : 0,
        };
        await createMark(dto);
      } else if (editingMark) {
        const dto: UpdateMarkDto = {
          id: editingMark.markId,
          studentId: editingMark.studentId,
          markStatus: values.markStatus,
          date: today,
          totalScore: values.markStatus === "IMTIHON_BAHO" ? values.totalScore : 0,
          activityScore: values.markStatus === "KUNLIK_BAHO" ? values.activityScore : 0,
          homeworkScore: values.markStatus === "KUNLIK_BAHO" ? values.homeworkScore : 0,
        };
        await updateMark(dto);
      }

      handleClose();
      refetch();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = (markId: number) => {
    deleteMark(markId);
    setTimeout(() => refetch(), 500);
  };

  const isImtihon = markStatus === "IMTIHON_BAHO";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="O'quvchi ismi bo'yicha qidirish..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(0);
          }}
          className="flex-1 rounded-lg"
          allowClear
        />
      </div>

      {/* Marks list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : marks.length === 0 ? (
        <Empty
          description="Hozircha baholar yo'q"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <div className="space-y-3">
            {marks.map((mark) => {
              const statusConfig = getMarkStatusConfig(mark.markStatus);
              const catColor = getCategoryColor(mark.markCategoryStatus);

              return (
                <div
                  key={mark.markId}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 dark:border-gray-600 hover:border-[#00A67D]/40 transition-all"
                >
                  {/* Student avatar */}
                  <Avatar
                    size={44}
                    src={mark.imageUrl || undefined}
                    icon={!mark.imageUrl ? <UserOutlined /> : undefined}
                    style={{ backgroundColor: PRIMARY_COLOR, flexShrink: 0 }}
                  />

                  {/* Student info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {mark.studentName}
                    </p>
                    {mark.markDate && (
                      <p className="text-xs text-gray-400 mt-0.5">{mark.markDate}</p>
                    )}
                  </div>

                  {/* Scores */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <Badge
                      count={mark.totalScore}
                      style={{ backgroundColor: catColor }}
                      showZero
                    >
                      <div className="px-3 py-1.5 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                        <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">Umumiy</span>
                      </div>
                    </Badge>

                    {mark.markStatus === "KUNLIK_BAHO" && (
                      <>
                        <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-center gap-1">
                            <FireOutlined className="text-blue-500 text-xs" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Faollik:</span>
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                              {mark.activityScore}
                            </span>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="flex items-center gap-1">
                            <BookOutlined className="text-purple-500 text-xs" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Uy:</span>
                            <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                              {mark.homeworkScore}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="hidden md:flex flex-col gap-1 flex-shrink-0">
                    <Tag color={statusConfig.color} icon={statusConfig.icon} className="m-0">
                      {statusConfig.text}
                    </Tag>
                    <Tag
                      icon={<CheckCircleOutlined />}
                      style={{ color: catColor, borderColor: catColor, background: catColor + "18" }}
                      className="m-0"
                    >
                      {getCategoryText(mark.markCategoryStatus)}
                    </Tag>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(mark)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <EditOutlined />
                    </button>
                    <Popconfirm
                      title="Bahoni o'chirish"
                      description="Bu bahoni o'chirmoqchimisiz?"
                      okText="Ha"
                      cancelText="Yo'q"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(mark.markId)}
                    >
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalElements > pageSize && (
            <div className="mt-4 flex justify-center">
              <Pagination
                current={page + 1}
                pageSize={pageSize}
                total={pagination.totalElements}
                onChange={(p) => setPage(p - 1)}
                showTotal={(total) => `Jami: ${total} ta baho`}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      {/* Modal - Add / Edit */}
      <ModalComponent
        open={isModalVisible}
        title={
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <TrophyOutlined className="text-white text-sm" />
            </div>
            <span>{isAddMode ? "Baho qo'shish" : "Bahoni tahrirlash"}</span>
          </div>
        }
        onOk={handleSave}
        onCancel={handleClose}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={isUpdating || isCreating}
      >
        <Form form={form} layout="vertical" className="mt-2">
          {/* O'quvchi tanlash - faqat add modeda */}
          {isAddMode && (
            <Form.Item
              name="studentId"
              label="O'quvchi"
              rules={[{ required: true, message: "O'quvchini tanlang" }]}
            >
              <Select
                placeholder="O'quvchini tanlang"
                showSearch
                optionFilterProp="children"
              >
                {students.map((s) => {
                  const sId = s.studentId ?? s.id;
                  const sName = s.fulName ?? s.fullName ?? "";
                  return (
                    <Select.Option key={sId} value={sId}>
                      {sName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}

          {/* Baho turi */}
          <Form.Item name="markStatus" label="Baho turi">
            <Select onChange={handleMarkStatusChange}>
              <Select.Option value="KUNLIK_BAHO">
                <BookOutlined className="mr-1" /> Kunlik baho
              </Select.Option>
              <Select.Option value="IMTIHON_BAHO">
                <TrophyOutlined className="mr-1" /> Imtihon bahosi
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-3">
            <Form.Item
              name="totalScore"
              label="Umumiy ball"
              rules={[
                { required: isImtihon, message: "Kiriting" },
                { type: "number", min: 0, max: 100, message: "0–100" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
                disabled={!isImtihon}
              />
            </Form.Item>

            <Form.Item
              name="activityScore"
              label="Faollik"
              rules={[
                { required: !isImtihon, message: "Kiriting" },
                { type: "number", min: 0, max: 100, message: "0–100" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
                disabled={isImtihon}
              />
            </Form.Item>

            <Form.Item
              name="homeworkScore"
              label="Uy ishi"
              rules={[
                { required: !isImtihon, message: "Kiriting" },
                { type: "number", min: 0, max: 100, message: "0–100" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
                disabled={isImtihon}
              />
            </Form.Item>
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-400 -mt-2">
            {isImtihon
              ? "Imtihon bahosida faqat Umumiy ball to'ldiriladi"
              : "Kunlik bahoda Faollik va Uy ishi ballari to'ldiriladi"}
          </p>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default StudentMarksSection;