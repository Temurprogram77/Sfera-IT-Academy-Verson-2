"use client";

import { useEffect, useState } from "react";
import { Card, DatePicker, Breadcrumb, Row, Col, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { createSSE } from "../../services/sseService";
import StatisticsBar from "../../components/attendance/StatisticsBar";
// import AttendanceTable from './AttendanceTable';
import { useParams, useNavigate } from "react-router-dom";

interface AttendanceRecord {
  id: number;
  fullName: string;
  studentId: number;
  status: string;
  description: string | null;
  date: string;
}

interface Group {
  id: number;
  name: string;
  teacherName: string;
  studentCount: number;
}

export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const groupId = id as string;

  const onBack = () => navigate(-1);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // Guruh ma'lumotlarini olish
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        console.log("Fetching group with ID:", groupId);

        const response = await fetch(
          `http://5.189.158.5:8082/groups/${groupId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Group data received:", data);
        setGroup(data);
      } catch (error) {
        console.error("Guruh ma'lumotlarini olishda xato:", error);
        message.error("Guruh ma'lumotlarini yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  // Davomat ma'lumotlarini SSE orqali olish
  useEffect(() => {
    if (!groupId) {
      console.log("GroupId yo'q, SSE ochilmaydi");
      return;
    }

    console.log("SSE ulanish ochilmoqda:", groupId);

    const sse = createSSE({
      url: `http://5.189.158.5:8082/attendance/stream/${groupId}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => {
        console.log("Davomat ma'lumotlari keldi:", data);
        setAttendance(data);
      },
      onError: (error) => {
        console.error("SSE xatosi:", error);
        message.error("Davomat ma'lumotlarini olishda xato");
      },
      onOpen: () => {
        console.log("SSE muvaffaqiyatli ulandi");
      },
    });

    return () => {
      console.log("SSE yopilmoqda");
      sse.close();
    };
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Yuklanmoqda..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Guruh topilmadi</div>
        <button
          onClick={onBack}
          className="mt-4 text-green-600 hover:text-green-700"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            onClick: onBack,
            title: (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <ArrowLeftOutlined />
                Guruhlar
              </button>
            ),
          },
          {
            title: (
              <span className="font-medium text-gray-900">{group.name}</span>
            ),
          },
        ]}
      />

      {/* Group Info */}
      <Card className="shadow-sm border border-gray-200">
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Guruh nomi
              </div>
              <div className="text-lg font-bold text-gray-900">
                {group.name}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                O'qituvchi
              </div>
              <div className="text-lg font-bold text-gray-900">
                {group.teacherName}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Talabalar soni
              </div>
              <div className="text-lg font-bold text-gray-900">
                {group.studentCount}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Date Picker */}
      <Card className="shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Sana tanlang
            </div>
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              style={{ width: "100%", maxWidth: 300 }}
            />
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <StatisticsBar
        presentCount={attendance.filter((a) => a.status === "KELDI").length}
        lateCount={attendance.filter((a) => a.status === "KECHIKTI").length}
        absentCount={attendance.filter((a) => a.status === "KELMADI").length}
      />

      {/* Attendance Table */}
      {/* <AttendanceTable students={attendance} /> */}
    </div>
  );
}
