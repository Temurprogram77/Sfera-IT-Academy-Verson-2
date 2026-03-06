// components/StudentList.tsx
import React, { useState } from "react";
import { Table, Avatar, Space, Typography, Empty, Button, Tooltip } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useGroupDetails } from "../../hooks/useGroups";
import { useAssessment } from "../../hooks/useAssessment";
import AssessmentFormModal from "./AssessmentFormModal";
import type { Assessment } from "../../types/assessment";

const { Text } = Typography;

interface StudentListProps {
  groupId: number | string;
  groupName?: string;
}

// API strukturasiga mos Student interfeysi
interface Student {
  id: number;
  fulName: string;
  imgUrl: string | null;
  phoneNumber: string;
  parentName?: string;
  parentPhone?: string;
}

const StudentList: React.FC<StudentListProps> = ({ groupId, groupName }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [createStudentId, setCreateStudentId] = useState<number | null>(null);
  const [createStudentName, setCreateStudentName] = useState<string>("");

  // Guruhdagi o'quvchilarni olish
  const { students = [], loading: studentsLoading, error } = useGroupDetails(groupId);

  // Baholar bilan ishlash uchun hook
  const {
    createAssessment,
    isCreating,
    updateAssessment,
    isUpdating,
  } = useAssessment(groupId);

  // Bahoni yaratish modali ochish
  const handleOpenCreateAssessment = (student: Student) => {
    setCreateStudentId(student.id);
    setCreateStudentName(student.fulName);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCreateStudentId(null);
    setCreateStudentName("");
  };

  const columns: ColumnsType<Student> = [
    {
      title: "O'quvchi",
      key: "fulName",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.imgUrl || undefined}
            icon={<UserOutlined />}
            size={40}
            style={{ background: "#4f46e5" }}
          />
          <div>
            <Text strong>{record.fulName}</Text>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.phoneNumber || "—"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text?: string) => text || "—",
    },
    {
      title: "Ota-ona",
      key: "parent",
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>
          {record.parentName || "—"}
          <br />
          <span style={{ color: "#6b7280" }}>{record.parentPhone || ""}</span>
        </div>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      align: "center",
      width: 160,
      render: (_, record) => (
        <Tooltip title="Ushbu o'quvchiga baho qo'yish">
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleOpenCreateAssessment(record)}
            style={{ background: "#4f46e5", borderColor: "#4f46e5" }}
          >
            Baho
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          {groupName
            ? `${groupName} guruhi o'quvchilari`
            : "Guruh o'quvchilari"}
        </Text>
        <Text style={{ color: "#6b7280" }}>
          Jami: <b>{students.length}</b> ta o'quvchi
        </Text>
      </div>

      <Table<Student>
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={studentsLoading}
        locale={{
          emptyText: (
            <Empty
              description={
                error
                  ? "Ma'lumotlarni yuklab bo'lmadi"
                  : studentsLoading
                    ? "Yuklanmoqda..."
                    : "Hozircha o'quvchilar yo'q"
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      {/* Baholar qo'yish modali */}
      <AssessmentFormModal
        open={modalOpen}
        onClose={handleModalClose}
        groupId={groupId}
        createStudentId={createStudentId}
        createStudentName={createStudentName}
        onCreate={createAssessment} // API ga yuborish
        isCreating={isCreating}
        onUpdate={updateAssessment} // Agar kerak bo'lsa yangilash
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default StudentList;