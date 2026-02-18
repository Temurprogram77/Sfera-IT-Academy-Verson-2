"use client";

import { useEffect, useState } from "react";
import {
  Card,
  DatePicker,
  Breadcrumb,
  Row,
  Col,
  Spin,
  Alert,
  Table,
  Tag,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { createSSE } from "../../services/sseService";
import StatisticsBar from "../../components/attendance/StatisticsBar";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupDetails } from "../../hooks/useGroups";

interface AttendanceRecord {
  id: number;
  fullName: string;
  studentId: number;
  status: string;
  description: string | null;
  date: string;
}

export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const { group, students, loading, error } = useGroupDetails(id!);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    if (!id) return;

    const sse = createSSE({
      url: `${baseUrl}/attendance/stream/${id}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => {
        console.log("Attendance data received:", data);
        setAttendance(data);
      },
    });

    return () => sse.close();
  }, [id]);

  const handleBack = () => {
    navigate("/attendance");
  };

  const filteredAttendance = attendance.filter((record) => {
    const recordDate = dayjs(record.date).format("YYYY-MM-DD");
    const selected = selectedDate.format("YYYY-MM-DD");
    return recordDate === selected;
  });

  const columns = [
    {
      title: "№",
      key: "index",
      width: 70,
      render: (_: any, __: any, index: number) => (
        <span className="font-medium">{index + 1}</span>
      ),
    },
    {
      title: "F.I.SH",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Holat",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center" as const,
      render: (status: string) => {
        let color = "default";
        let text = status;

        if (status === "KELDI") {
          color = "green";
          text = "Keldi";
        } else if (status === "KECHIKTI") {
          color = "orange";
          text = "Kechikdi";
        } else if (status === "KELMADI") {
          color = "red";
          text = "Kelmadi";
        }

        return (
          <Tag color={color} className="font-medium">
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Izoh",
      dataIndex: "description",
      key: "description",
      render: (description: string | null) => (
        <span className="text-gray-600">{description || "Izoh yo'q"}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert
          title="Xatolik"
          description="Guruh ma'lumotlarini yuklashda xatolik yuz berdi"
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert
          title="Guruh topilmadi"
          description={`ID: ${id} bo'yicha guruh topilmadi`}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="space-y-6">
        <Breadcrumb
          items={[
            {
              title: (
                <button
                  onClick={handleBack}
                  className="flex items-center mb-[1rem] gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
                >
                  <ArrowLeftOutlined />
                  Guruhlar
                </button>
              ),
            },
            {
              title: (
                <span className="font-medium dark:text-white text-gray-900">
                  {group.name}
                </span>
              ),
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-[1rem]">
          {/* Guruh ma'lumotlari */}
          <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <Row gutter={[32, 24]}>
              <Col xs={24} sm={8}>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Guruh nomi
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {group.name}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    O'qituvchi
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {group.teacherName || "Belgilanmagan"}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Talabalar soni
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {students.length}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Sana tanlash */}
          <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Sana tanlang
            </div>
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              style={{ width: "100%", maxWidth: 300 }}
              format="DD.MM.YYYY"
              size="large"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </Card>

          {/* Statistika */}
          <StatisticsBar
            presentCount={
              filteredAttendance.filter((a) => a.status === "KELDI").length
            }
            lateCount={
              filteredAttendance.filter((a) => a.status === "KECHIKTI").length
            }
            absentCount={
              filteredAttendance.filter((a) => a.status === "KELMADI").length
            }
          />

          {/* Davomat jadvali */}
          <Card
            title={
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Davomat ro'yxati - {selectedDate.format("DD MMMM YYYY")}
              </span>
            }
            className="shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <Table
              columns={columns}
              dataSource={filteredAttendance}
              rowKey="id"
              pagination={false}
              className="dark:text-white [&_.ant-table]:dark:bg-gray-800 [&_.ant-table-thead_th]:dark:bg-gray-700 [&_.ant-table-thead_th]:dark:text-gray-200 [&_.ant-table-tbody_td]:dark:text-gray-300 [&_.ant-table-tbody_tr:hover_td]:dark:bg-gray-700 [&_.ant-table-bordered_.ant-table-cell]:dark:border-gray-600"
              locale={{
                emptyText: (
                  <div className="py-12">
                    <Alert
                      title={
                        <span className="dark:text-white">Ma'lumot yo'q</span>
                      }
                      description={
                        <span className="dark:text-gray-400">
                          {selectedDate.format("DD.MM.YYYY")} sanasi uchun
                          davomat ma'lumotlari topilmadi
                        </span>
                      }
                      type="info"
                      showIcon
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                ),
              }}
              bordered
              size="middle"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
