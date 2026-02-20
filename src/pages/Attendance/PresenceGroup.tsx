import { useMemo, useState, useEffect } from "react";
import {
  Card, Spin, Modal, Input, Button, Row, Col, Progress, Tag, Space, Typography,
} from "antd";
import {
  CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled,
  LockOutlined, CheckOutlined, CloseOutlined, RiseOutlined, WarningOutlined,
  LeftOutlined, RightOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";
import { useGroups, useGroupDetails } from "../../hooks/useGroups";
import ListHeader from "../../components/ListHeader/ListHeader";
import { createSSE } from "../../services/sseService";
import { apiClient } from "../../lib/api/client";

const { Text } = Typography;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const MONTHS_UZ = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const AVATAR_COLORS = ["#3b82f6","#8b5cf6","#10b981","#f43f5e","#f59e0b","#06b6d4","#ec4899","#6366f1","#14b8a6","#f97316"];

interface AttendanceRecord {
  studentId: number;
  status: "KELDI" | "KELMADI" | "SABABLI";
  description?: string | null;
  date: string;
}

const PresenceGroup = () => {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month());
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingCell, setLoadingCell] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ studentId: number; date: Dayjs; status: "KELMADI" | "SABABLI" } | null>(null);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { groups, loading: groupsLoading } = useGroups({ page: 0, size: 100 });
  const { students, loading: studentsLoading } = useGroupDetails(selectedGroupId ?? 0);

  useEffect(() => {
    if (groups && groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups]);

  useEffect(() => {
    if (!selectedGroupId) return;
    const sse = createSSE({
      url: `${baseUrl}/attendance/stream/${selectedGroupId}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => setAttendance(data),
      onError: () => toast.error("SSE ulanishda xatolik"),
    });
    return () => sse.close();
  }, [selectedGroupId]);

  const daysInMonth = useMemo(() => {
    const start = dayjs(new Date(year, month, 1)).startOf("month");
    const end = dayjs(new Date(year, month, 1)).endOf("month");
    const days: Dayjs[] = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }
    return days;
  }, [year, month]);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const getStatus = (studentId: number, date: Dayjs) =>
    attendance.find((a) => a.studentId === studentId && dayjs(a.date).isSame(date, "day"))?.status;

  const sendAttendance = async (
    studentId: number,
    date: Dayjs,
    status: "KELDI" | "KELMADI" | "SABABLI",
    desc?: string
  ) => {
    if (!selectedGroupId) return;
    const key = `${studentId}-${date.format("YYYY-MM-DD")}`;
    setLoadingCell(key);
    try {
      await apiClient.post(`/attendance?groupId=${selectedGroupId}`, [{
        studentId,
        status,
        description: status === "KELDI" ? null : desc ?? null,
        date: date.format("YYYY-MM-DD"),
      }]);
      toast.success("Davomat saqlandi");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoadingCell(null);
      setModalOpen(false);
      setDescription("");
    }
  };

  const openSelector = (studentId: number, date: Dayjs) => {
    if (date.isAfter(now, "day")) return;
    Modal.confirm({
      title: "Davomatni tanlang",
      icon: <ExclamationCircleFilled />,
      content: (
        <div className="flex gap-2 mt-4">
          <Button type="primary" onClick={() => { Modal.destroyAll(); sendAttendance(studentId, date, "KELDI"); }}>Keldi</Button>
          <Button danger onClick={() => { Modal.destroyAll(); setSelectedCell({ studentId, date, status: "KELMADI" }); setModalOpen(true); }}>Kelmadi</Button>
          <Button onClick={() => { Modal.destroyAll(); setSelectedCell({ studentId, date, status: "SABABLI" }); setModalOpen(true); }}>Sababli</Button>
        </div>
      ),
      footer: null,
    });
  };

  const getStudentRate = (studentId: number) => {
    const pastDays = daysInMonth.filter((d) => !d.isAfter(now, "day"));
    const keldi = pastDays.filter((d) => {
      const st = getStatus(studentId, d);
      return st === "KELDI" || st === "SABABLI";
    }).length;
    return pastDays.length > 0 ? Math.round((keldi / pastDays.length) * 100) : 0;
  };

  const stats = useMemo(() => {
    const pastDays = daysInMonth.filter((d) => !d.isAfter(now, "day"));
    let totalKeldi = 0, totalKelmadi = 0, totalSababli = 0;
    students.forEach((s: any) => {
      pastDays.forEach((d) => {
        const status = getStatus(s.id, d);
        if (status === "KELDI") totalKeldi++;
        if (status === "KELMADI") totalKelmadi++;
        if (status === "SABABLI") totalSababli++;
      });
    });
    const possible = students.length * pastDays.length;
    const rate = possible > 0 ? Math.round(((totalKeldi + totalSababli) / possible) * 100) : 0;
    return { totalKeldi, totalKelmadi, totalSababli, rate };
  }, [attendance, students, daysInMonth]);

  const filteredStudents = students.filter((s: any) =>
    (s.fulName || s.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowAttendanceStudents = filteredStudents.filter((s: any) => {
    const rate = getStudentRate(s.id);
    return rate < 75 && rate > 0;
  });

  if (groupsLoading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

  return (
    <div style={{ padding: "0 0 24px" }}>
      <ListHeader
        title="Davomat"
        count={filteredStudents.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="O'quvchi qidirish..."
        selectOption={groups.map((g) => ({ value: g.id, label: g.name }))}
        onSelectChange={(val: number) => { setSelectedGroupId(val); setAttendance([]); setSearchTerm(""); }}
        selectValue={selectedGroupId ?? undefined}
      />

      {/* Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {[
          { label: "Keldi", value: stats.totalKeldi, icon: <CheckOutlined style={{ color: "#10b981" }} />, bg: "#ecfdf5" },
          { label: "Kelmadi", value: stats.totalKelmadi, icon: <CloseOutlined style={{ color: "#ef4444" }} />, bg: "#fef2f2" },
          { label: "Sababli", value: stats.totalSababli, icon: <ExclamationCircleFilled style={{ color: "#f59e0b" }} />, bg: "#fffbeb" },
          { label: "Davomat %", value: `${stats.rate}%`, icon: <RiseOutlined style={{ color: "#8b5cf6" }} />, bg: "#f5f3ff" },
        ].map((s) => (
          <Col xs={12} sm={6} key={s.label}>
            <Card size="small" styles={{ body: { padding: "12px 16px" } }}>
              <Space size={12} align="center">
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{s.label}</Text>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{s.value}</div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Calendar */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{ overflow: "hidden", marginBottom: 16 }}
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Button type="text" icon={<LeftOutlined />} onClick={prevMonth} size="small" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{MONTHS_UZ[month]} {year}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{groups.find(g => g.id === selectedGroupId)?.name}</div>
            </div>
            <Button type="text" icon={<RightOutlined />} onClick={nextMonth} size="small" />
          </div>
        }
      >
        {studentsLoading ? (
          <div className="flex justify-center py-10"><Spin size="large" /></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: "max-content" }}>
              {/* Header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `200px repeat(${daysInMonth.length}, 36px) 90px`,
                borderBottom: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}>
                <div style={{ padding: "8px 12px", fontWeight: 600, fontSize: 12, borderRight: "1px solid #e5e7eb" }}>O'quvchilar</div>
                {daysInMonth.map((day) => {
                  const isFuture = day.isAfter(now, "day");
                  const isToday = day.isSame(now, "day");
                  const dow = ["Ya","Du","Se","Cho","Pa","Ju","Sha"][day.day()];
                  return (
                    <div key={day.toString()} style={{
                      textAlign: "center", borderRight: "1px solid #e5e7eb", padding: "4px 2px",
                      background: isToday ? "#eff6ff" : isFuture ? "#f8fafc" : undefined,
                    }}>
                      <div style={{ fontSize: 9, color: "#94a3b8" }}>{dow}</div>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", margin: "2px auto 0",
                        background: isToday ? "#2563eb" : "transparent",
                        color: isToday ? "#fff" : isFuture ? "#cbd5e1" : "#475569",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                      }}>{day.format("DD")}</div>
                    </div>
                  );
                })}
                <div style={{ padding: "8px 4px", fontWeight: 600, fontSize: 12, textAlign: "center" }}>Natija</div>
              </div>

              {/* Body */}
              {filteredStudents.map((student: any, index: number) => {
                const rate = getStudentRate(student.id);
                const name = student.fulName || student.fullName || "";
                return (
                  <div key={student.id} style={{
                    display: "grid",
                    gridTemplateColumns: `200px repeat(${daysInMonth.length}, 36px) 90px`,
                    borderBottom: "1px solid #e5e7eb",
                    background: index % 2 === 0 ? "#fff" : "#f8fafc",
                  }}>
                    <div style={{ padding: "6px 10px", borderRight: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: AVATAR_COLORS[index % AVATAR_COLORS.length],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0,
                      }}>
                        {name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <Text style={{ fontSize: 12, fontWeight: 500 }} ellipsis>{name}</Text>
                    </div>

                    {daysInMonth.map((day) => {
                      const isFuture = day.isAfter(now, "day");
                      const isToday = day.isSame(now, "day");
                      const cellKey = `${student.id}-${day.format("YYYY-MM-DD")}`;
                      const status = getStatus(student.id, day);
                      return (
                        <div key={day.toString()}
                          onClick={() => !isFuture && openSelector(student.id, day)}
                          style={{
                            display: "flex", justifyContent: "center", alignItems: "center",
                            borderRight: "1px solid #e5e7eb", height: 40,
                            cursor: isFuture ? "default" : "pointer",
                            background: isToday ? "#eff6ff50" : isFuture ? "#f8fafc" : undefined,
                          }}
                          onMouseEnter={(e) => { if (!isFuture) (e.currentTarget as HTMLDivElement).style.background = "#dbeafe"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = isToday ? "#eff6ff50" : isFuture ? "#f8fafc" : index % 2 === 0 ? "#fff" : "#f8fafc"; }}
                        >
                          {loadingCell === cellKey ? (
                            <Spin size="small" />
                          ) : isFuture ? (
                            <LockOutlined style={{ color: "#cbd5e1", fontSize: 12 }} />
                          ) : status === "KELDI" ? (
                            <CheckCircleFilled style={{ color: "#10b981", fontSize: 16 }} />
                          ) : status === "KELMADI" ? (
                            <CloseCircleFilled style={{ color: "#ef4444", fontSize: 16 }} />
                          ) : status === "SABABLI" ? (
                            <ExclamationCircleFilled style={{ color: "#f59e0b", fontSize: 16 }} />
                          ) : (
                            <span style={{ color: "#d1d5db", fontSize: 14 }}>—</span>
                          )}
                        </div>
                      );
                    })}

                    <div style={{ padding: "4px 6px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Progress percent={rate} showInfo={false} size="small"
                        strokeColor={rate >= 80 ? "#10b981" : rate >= 60 ? "#f59e0b" : "#ef4444"}
                        style={{ margin: 0 }} />
                      <Text style={{ fontSize: 10, fontWeight: 700, textAlign: "right",
                        color: rate >= 80 ? "#10b981" : rate >= 60 ? "#f59e0b" : "#ef4444" }}>
                        {rate}%
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Past davomat */}
      {lowAttendanceStudents.length > 0 && (
        <Card size="small" style={{ marginBottom: 16 }}
          title={
            <Space>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <Text style={{ fontSize: 13, fontWeight: 600 }}>Past davomatli o'quvchilar</Text>
            </Space>
          }
        >
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            {lowAttendanceStudents.map((s: any, i: number) => {
              const rate = getStudentRate(s.id);
              const name = s.fulName || s.fullName || "";
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12 }}>{name}</Text>
                    <Progress percent={rate} showInfo={false} size="small" strokeColor="#ef4444" style={{ margin: 0 }} />
                  </div>
                  <Tag color="error" icon={<WarningOutlined />} style={{ fontSize: 10, marginRight: 0 }}>{rate}% Diqqat!</Tag>
                </div>
              );
            })}
          </Space>
        </Card>
      )}

      <Modal
        title="Sababni kiriting"
        open={modalOpen}
        onOk={() => {
          if (!description) return toast.warning("Sabab yozing");
          if (selectedCell) sendAttendance(selectedCell.studentId, selectedCell.date, selectedCell.status, description);
        }}
        onCancel={() => setModalOpen(false)}
      >
        <Input.TextArea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Modal>
    </div>
  );
};

export default PresenceGroup;