"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Breadcrumb,
  Spin,
  Alert,
  message,
  Modal,
  Input,
  Button,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  LockOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { createSSE } from "../../services/sseService";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupDetails } from "../../hooks/useGroups";

interface AttendanceRecord {
  id?: number;
  studentId: number;
  status: "KELDI" | "KELMADI" | "SABABLI";
  description?: string | null;
  date: string;
}

export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMonth] = useState<Dayjs>(dayjs());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingCell, setLoadingCell] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    studentId: number;
    date: Dayjs;
    status: "KELMADI" | "SABABLI";
  } | null>(null);
  const [description, setDescription] = useState("");

  const { group, students, loading, error } = useGroupDetails(id!);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // ================= SSE =================
  useEffect(() => {
    if (!id) return;

    const sse = createSSE({
      url: `${baseUrl}/attendance/stream/${id}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => {
        setAttendance(data);
      },
    });

    return () => sse.close();
  }, [id]);

  const handleBack = () => navigate("/attendance");

  // ================= MONTH DAYS =================
  const daysInMonth = useMemo(() => {
    const start = selectedMonth.startOf("month");
    const end = selectedMonth.endOf("month");
    const days: Dayjs[] = [];

    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  }, [selectedMonth]);

  // ================= GET STATUS =================
  const getStatus = (studentId: number, date: Dayjs) => {
    const found = attendance.find(
      (a) =>
        a.studentId === studentId &&
        dayjs(a.date).isSame(date, "day")
    );
    return found?.status;
  };

  // ================= OPEN STATUS SELECTOR =================
  const openSelector = (studentId: number, date: Dayjs) => {
    if (date.isAfter(dayjs(), "day")) return;

    Modal.confirm({
      title: "Davomatni tanlang",
      icon: <ExclamationCircleFilled />,
      content: (
        <div className="flex gap-2 mt-4">
          <Button
            type="primary"
            onClick={() => sendAttendance(studentId, date, "KELDI")}
          >
            Keldi
          </Button>

          <Button
            danger
            onClick={() => {
              setSelectedCell({ studentId, date, status: "KELMADI" });
              setModalOpen(true);
            }}
          >
            Kelmadi
          </Button>

          <Button
            onClick={() => {
              setSelectedCell({ studentId, date, status: "SABABLI" });
              setModalOpen(true);
            }}
          >
            Sababli
          </Button>
        </div>
      ),
      footer: null,
    });
  };

  // ================= SEND =================
  const sendAttendance = async (
    studentId: number,
    date: Dayjs,
    status: "KELDI" | "KELMADI" | "SABABLI",
    desc?: string
  ) => {
    if (!id) return;

    const key = `${studentId}-${date.format("YYYY-MM-DD")}`;
    setLoadingCell(key);

    try {
      await fetch(`${baseUrl}/attendance?groupId=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            studentId,
            status,
            description: status === "KELDI" ? null : desc,
            date: date.format("YYYY-MM-DD"),
          },
        ]),
      });

      message.success("Saqlandi");
    } catch {
      message.error("Xatolik yuz berdi");
    } finally {
      setLoadingCell(null);
      setModalOpen(false);
      setDescription("");
    }
  };
  console.log(attendance);
  
  // ================= UI =================
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !group) {
    return <Alert type="error" message="Ma'lumot yuklanmadi" />;
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <Breadcrumb
        items={[
          {
            title: (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-green-600 font-medium"
              >
                <ArrowLeftOutlined />
                Guruhlar
              </button>
            ),
          },
          { title: group.name },
        ]}
      />

      <Card className="mt-4 overflow-auto">
        <div className="min-w-[1000px]">

          {/* HEADER */}
          <div className="grid grid-cols-[250px_repeat(auto-fill,60px)] border-b bg-gray-50">
            <div className="p-3 font-semibold border-r">
              O‘quvchilar
            </div>

            {daysInMonth.map((day) => (
              <div key={day.toString()} className="p-3 text-center border-r">
                {day.format("DD")}
              </div>
            ))}
          </div>

          {/* BODY */}
          {students.map((student: any, index: number) => (
            <div
              key={student.id}
              className="grid grid-cols-[250px_repeat(auto-fill,60px)] border-b"
            >
              <div className="p-3 border-r font-medium">
                {index + 1}. {student.fullName}
              </div>

              {daysInMonth.map((day) => {
                const status = getStatus(student.id, day);
                const isFuture = day.isAfter(dayjs(), "day");
                const cellKey = `${student.id}-${day.format("YYYY-MM-DD")}`;

                return (
                  <div
                    key={day.toString()}
                    onClick={() => openSelector(student.id, day)}
                    className={`p-3 flex justify-center items-center border-r
                    ${!isFuture && "cursor-pointer hover:bg-green-50"}`}
                  >
                    {loadingCell === cellKey ? (
                      <Spin size="small" />
                    ) : isFuture ? (
                      <LockOutlined className="text-gray-400 text-lg" />
                    ) : status === "KELDI" ? (
                      <CheckCircleFilled className="text-green-500 text-xl" />
                    ) : status === "KELMADI" ? (
                      <CloseCircleFilled className="text-red-500 text-xl" />
                    ) : status === "SABABLI" ? (
                      <ExclamationCircleFilled className="text-yellow-500 text-xl" />
                    ) : (
                      <span className="text-gray-300 text-lg">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* DESCRIPTION MODAL */}
      <Modal
        title="Sababni kiriting"
        open={modalOpen}
        onOk={() => {
          if (!description) return message.warning("Sabab yozing");

          if (selectedCell) {
            sendAttendance(
              selectedCell.studentId,
              selectedCell.date,
              selectedCell.status,
              description
            );
          }
        }}
        onCancel={() => setModalOpen(false)}
      >
        <Input.TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Modal>
    </div>
  );
}
