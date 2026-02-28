// components/AssessmentHistoryTable.tsx
import React, { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Space,
  Avatar,
  Empty,
  Statistic,
  Row,
  Col,
  Card,
} from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  BookOutlined,
  FireOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAssessment } from "../../hooks/useAssessment";
import type { Assessment } from "../../types/assessment";

const { Text } = Typography;

interface AssessmentHistoryTableProps {
  groupId: number | string;
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

const AssessmentHistoryTable: React.FC<AssessmentHistoryTableProps> = ({
  groupId,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { assessments, pagination, loading } = useAssessment(groupId, {
    page,
    size: pageSize,
  });

  // Stats
  const yashilCount = assessments.filter(
    (a) => a.markCategoryStatus === "YASHIL"
  ).length;
  const sariqCount = assessments.filter(
    (a) => a.markCategoryStatus === "SARIQ"
  ).length;
  const qizilCount = assessments.filter(
    (a) => a.markCategoryStatus === "QIZIL"
  ).length;

  const columns: ColumnsType<Assessment> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, idx) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {page * pageSize + idx + 1}
        </Text>
      ),
    },
    {
      title: "O'quvchi",
      dataIndex: "studentName",
      key: "studentName",
      render: (name: string, record) => (
        <Space>
          <Avatar
            src={record.imageUrl}
            icon={!record.imageUrl ? <UserOutlined /> : undefined}
            size={32}
            style={{ background: "#6d28d9" }}
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
          {status === "KUNLIK_BAHO" ? "Kunlik" : "Imtihon"}
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
          <Text strong style={{ color: "#4f46e5" }}>
            {score}
          </Text>
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
          <Text strong style={{ color: "#0891b2" }}>
            {score}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Jami",
      key: "total",
      align: "center",
      render: (_, record) => {
        const total =
          record.markStatus === "IMTIHON_BAHO"
            ? record.totalScore
            : record.activityScore + record.homeworkScore;
        return (
          <Text strong style={{ fontSize: 15 }}>
            {total}
          </Text>
        );
      },
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
  ];

  return (
    <div>
      {/* Stats row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 10,
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
              border: "1px solid #a7f3d0",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: "#065f46" }}>
                  <TrophyOutlined /> Yaxshi
                </Text>
              }
              value={yashilCount}
              suffix="ta"
              valueStyle={{ color: "#059669", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 10,
              background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              border: "1px solid #fde68a",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: "#92400e" }}>
                  <BookOutlined /> O'rtacha
                </Text>
              }
              value={sariqCount}
              suffix="ta"
              valueStyle={{ color: "#d97706", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 10,
              background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
              border: "1px solid #fecdd3",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: "#9f1239" }}>
                  <FireOutlined /> Yomon
                </Text>
              }
              value={qizilCount}
              suffix="ta"
              valueStyle={{ color: "#e11d48", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Table<Assessment>
        columns={columns}
        dataSource={assessments}
        loading={loading}
        rowKey="markId"
        locale={{
          emptyText: (
            <Empty
              description="Baholash tarixi yo'q"
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
        scroll={{ x: 800 }}
        bordered={false}
        style={{ borderRadius: 8 }}
        rowClassName={(record) =>
          record.markCategoryStatus === "YASHIL"
            ? "row-green"
            : record.markCategoryStatus === "QIZIL"
              ? "row-red"
              : ""
        }
      />
    </div>
  );
};

export default AssessmentHistoryTable;