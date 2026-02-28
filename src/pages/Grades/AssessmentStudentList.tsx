// components/AssessmentStudentList.tsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Avatar,
  Tag,
  Space,
  Typography,
  Empty,
  Tooltip,
  Popconfirm,
} from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAssessment } from "../../hooks/useAssessment";
import type { Assessment } from "../../types/assessment";
import AssessmentFormModal from "./AssessmentFormModal";

const { Text } = Typography;

interface AssessmentStudentListProps {
  groupId: number | string;
  groupName?: string;
}

const categoryColors: Record<string, string> = {
  YASHIL: "success",
  SARIQ: "warning",
  QIZIL: "error",
};

const categoryLabels: Record<string, string> = {
  YASHIL: "Yaxshi",
  SARIQ: "O'rtacha",
  QIZIL: "Yomon",
};

const AssessmentStudentList: React.FC<AssessmentStudentListProps> = ({
  groupId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [createStudentId, setCreateStudentId] = useState<number | null>(null);
  const [createStudentName, setCreateStudentName] = useState<string>("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    assessments,
    pagination,
    loading,
    createAssessment,
    isCreating,
    updateAssessment,
    isUpdating,
    deleteAssessment,
    isDeleting,
  } = useAssessment(groupId, { page, size: pageSize });

  const handleOpenCreate = (studentId: number, studentName: string) => {
    setSelectedAssessment(null);
    setCreateStudentId(studentId);
    setCreateStudentName(studentName);
    setModalOpen(true);
  };

  const handleOpenEdit = (record: Assessment) => {
    setSelectedAssessment(record);
    setCreateStudentId(null);
    setCreateStudentName("");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAssessment(null);
    setCreateStudentId(null);
    setCreateStudentName("");
  };

  const columns: ColumnsType<Assessment> = [
    {
      title: "O'quvchi",
      dataIndex: "studentName",
      key: "studentName",
      render: (name: string, record) => (
        <Space>
          <Avatar
            src={record.imageUrl}
            icon={!record.imageUrl ? <UserOutlined /> : undefined}
            size={36}
            style={{ background: "#4f46e5" }}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Baho turi",
      dataIndex: "markStatus",
      key: "markStatus",
      render: (status: string) => (
        <Tag color={status === "KUNLIK_BAHO" ? "blue" : "purple"}>
          {status === "KUNLIK_BAHO" ? "Kunlik baho" : "Imtihon bahosi"}
        </Tag>
      ),
    },
    {
      title: "Faollik",
      dataIndex: "activityScore",
      key: "activityScore",
      align: "center",
      render: (score: number, record) =>
        record.markStatus === "KUNLIK_BAHO" ? (
          <Text strong style={{ color: "#4f46e5" }}>{score}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Uyga vazifa",
      dataIndex: "homeworkScore",
      key: "homeworkScore",
      align: "center",
      render: (score: number, record) =>
        record.markStatus === "KUNLIK_BAHO" ? (
          <Text strong style={{ color: "#0891b2" }}>{score}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Jami ball",
      key: "totalScore",
      align: "center",
      render: (_, record) =>
        record.markStatus === "IMTIHON_BAHO" ? (
          <Text strong style={{ color: "#7c3aed", fontSize: 16 }}>
            {record.totalScore}
          </Text>
        ) : (
          <Text strong>{record.activityScore + record.homeworkScore}</Text>
        ),
    },
    {
      title: "Holat",
      dataIndex: "markCategoryStatus",
      key: "markCategoryStatus",
      align: "center",
      render: (status: string) =>
        status ? (
          <Tag color={categoryColors[status] || "default"}>
            {categoryLabels[status] || status}
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Sana",
      dataIndex: "markDate",
      key: "markDate",
      render: (date: string) =>
        date ? (
          <Text type="secondary">{dayjs(date).format("DD.MM.YYYY")}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Amallar",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Shu o'quvchiga yangi baho qo'shish">
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenCreate(record.studentId, record.studentName)}
              style={{ background: "#4f46e5", borderColor: "#4f46e5" }}
            >
              Baho
            </Button>
          </Tooltip>

          <Tooltip title="Tahrirlash">
            <Button size="small" onClick={() => handleOpenEdit(record)}>
              Tahrirlash
            </Button>
          </Tooltip>

          <Popconfirm
            title="Bahoni o'chirish"
            description="Haqiqatan ham o'chirmoqchimisiz?"
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteAssessment(record.markId)}
          >
            <Button size="small" danger loading={isDeleting}>
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Text style={{ fontSize: 15, color: "#6b7280" }}>
          Jami: <b>{pagination.totalElements}</b> ta baho
        </Text>
      </div>

      <Table<Assessment>
        columns={columns}
        dataSource={assessments}
        loading={loading}
        rowKey="markId"
        locale={{
          emptyText: (
            <Empty
              description="Hozircha baholar yo'q"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        pagination={{
          current: pagination.page + 1,
          pageSize: pagination.size,
          total: pagination.totalElements,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          onChange: (p, s) => {
            setPage(p - 1);
            setPageSize(s);
          },
          showTotal: (total) => `Jami ${total} ta yozuv`,
        }}
        scroll={{ x: 900 }}
      />

      <AssessmentFormModal
        open={modalOpen}
        onClose={handleModalClose}
        groupId={groupId}
        editData={selectedAssessment}
        createStudentId={createStudentId}
        createStudentName={createStudentName}
        onCreate={createAssessment}
        isCreating={isCreating}
        onUpdate={updateAssessment}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default AssessmentStudentList;