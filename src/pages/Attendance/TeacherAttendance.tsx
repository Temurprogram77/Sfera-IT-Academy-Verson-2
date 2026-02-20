// src/dashboards/teacher/main/TeacherAttendance.tsx
import { useState, useMemo } from "react";
import {
  Button,
  Select,
  Card,
  Badge,
  Tooltip,
  Progress,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Table,
  Alert,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  RiseOutlined,
  SaveOutlined,
  LeftOutlined,
  RightOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

/* ─── Types ─── */
type AttendanceStatus = "present" | "absent" | "late" | "none";

interface Student {
  id: string;
  name: string;
  avatar: string;
}

interface AttendanceRecord {
  [studentId: string]: AttendanceStatus;
}

interface MonthAttendance {
  [dateKey: string]: AttendanceRecord;
}

/* ─── Constants ─── */
const DAYS_UZ = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];
const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const STATUS_CYCLE: AttendanceStatus[] = ["none", "present", "absent", "late"];

interface StatusConfig {
  label: string;
  short: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG: Record<AttendanceStatus, StatusConfig> = {
  present: {
    label: "Keldi",
    short: "K",
    color: "#fff",
    bgColor: "#10b981",
    borderColor: "#10b981",
    icon: <CheckOutlined />,
  },
  absent: {
    label: "Kelmadi",
    short: "X",
    color: "#fff",
    bgColor: "#ef4444",
    borderColor: "#ef4444",
    icon: <CloseOutlined />,
  },
  late: {
    label: "Kech keldi",
    short: "K!",
    color: "#fff",
    bgColor: "#f59e0b",
    borderColor: "#f59e0b",
    icon: <ClockCircleOutlined />,
  },
  none: {
    label: "Belgilanmagan",
    short: "–",
    color: "#94a3b8",
    bgColor: "#f1f5f9",
    borderColor: "#e2e8f0",
    icon: <span>–</span>,
  },
};

const GROUPS = ["Beginner A-1", "Elementary B-3", "Pre-Int C-2", "IELTS D-5"];

const STUDENTS: Student[] = [
  { id: "1", name: "Jasur Toshmatov", avatar: "JT" },
  { id: "2", name: "Malika Yusupova", avatar: "MY" },
  { id: "3", name: "Bobur Rahimov", avatar: "BR" },
  { id: "4", name: "Dilnoza Karimova", avatar: "DK" },
  { id: "5", name: "Sardor Mirzayev", avatar: "SM" },
  { id: "6", name: "Nilufar Hasanova", avatar: "NH" },
  { id: "7", name: "Otabek Umarov", avatar: "OU" },
  { id: "8", name: "Zulfiya Aliyeva", avatar: "ZA" },
  { id: "9", name: "Farrux Qodirov", avatar: "FQ" },
  { id: "10", name: "Shahlo Nazarova", avatar: "SN" },
];

const AVATAR_COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f43f5e",
  "#f59e0b", "#06b6d4", "#ec4899", "#6366f1",
  "#14b8a6", "#f97316",
];

const STORAGE_KEY = "teacher_attendance_v1";

function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function loadData(): MonthAttendance {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveData(data: MonthAttendance) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ─── Main Component ─── */
const TeacherAttendance = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0]);
  const [attendance, setAttendance] = useState<MonthAttendance>(loadData);
  const [saved, setSaved] = useState(false);

  /* Calendar grid */
  const { totalDays } = useMemo(() => {
    const total = new Date(year, month + 1, 0).getDate();
    return { totalDays: total };
  }, [year, month]);

  /* Class days (Mon-Fri) */
  const classDays = useMemo(() => {
    const set = new Set<number>();
    for (let d = 1; d <= totalDays; d++) {
      const dow = new Date(year, month, d).getDay();
      if (dow !== 0 && dow !== 6) set.add(d);
    }
    return set;
  }, [year, month, totalDays]);

  /* Stats */
  const stats = useMemo(() => {
    const classDayCount = classDays.size;
    let totalPresent = 0, totalAbsent = 0, totalLate = 0, totalMarked = 0;

    STUDENTS.forEach((s) => {
      classDays.forEach((d) => {
        const key = dateKey(year, month, d);
        const status = attendance[key]?.[s.id] ?? "none";
        if (status !== "none") totalMarked++;
        if (status === "present") totalPresent++;
        if (status === "absent") totalAbsent++;
        if (status === "late") totalLate++;
      });
    });

    const possible = STUDENTS.length * classDayCount;
    const rate = possible > 0 ? Math.round(((totalPresent + totalLate) / possible) * 100) : 0;
    return { classDayCount, totalPresent, totalAbsent, totalLate, totalMarked, possible, rate };
  }, [attendance, classDays, year, month]);

  /* Toggle cell */
  const toggle = (day: number, studentId: string) => {
    const key = dateKey(year, month, day);
    const current: AttendanceStatus = attendance[key]?.[studentId] ?? "none";
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setAttendance((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), [studentId]: next },
    }));
    setSaved(false);
  };

  /* Mark all for a day */
  const markAll = (day: number, status: AttendanceStatus) => {
    const key = dateKey(year, month, day);
    const record: AttendanceRecord = {};
    STUDENTS.forEach((s) => (record[s.id] = status));
    setAttendance((prev) => ({ ...prev, [key]: record }));
    setSaved(false);
  };

  /* Reset a day */
  const resetDay = (day: number) => {
    const key = dateKey(year, month, day);
    setAttendance((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setSaved(false);
  };

  const handleSave = () => {
    saveData(attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  /* Student per-month stats */
  const studentStats = (studentId: string) => {
    let p = 0, a = 0, l = 0;
    classDays.forEach((d) => {
      const status = attendance[dateKey(year, month, d)]?.[studentId] ?? "none";
      if (status === "present") p++;
      if (status === "absent") a++;
      if (status === "late") l++;
    });
    const rate = classDays.size > 0 ? Math.round(((p + l) / classDays.size) * 100) : 0;
    return { p, a, l, rate };
  };

  const lowAttendanceStudents = STUDENTS.filter((s) => {
    const { rate } = studentStats(s.id);
    return rate < 75 && rate > 0;
  });

  /* Build table columns */
  const dayColumns = Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
    const dow = new Date(year, month, d).getDay();
    const weekend = dow === 0 || dow === 6;
    const todayMark = isToday(d);
    const dayLabel = DAYS_UZ[dow === 0 ? 6 : dow - 1];

    return {
      key: `day-${d}`,
      title: (
        <Tooltip
          title={
            <div style={{ textAlign: "center" }}>
              <div>{MONTHS_UZ[month]} {d}</div>
              {!weekend && (
                <Space direction="vertical" size={2} style={{ marginTop: 4 }}>
                  <Button
                    size="small"
                    style={{ fontSize: 10, height: 20, background: "#10b981", color: "#fff", border: "none" }}
                    onClick={(e) => { e.stopPropagation(); markAll(d, "present"); }}
                  >
                    ✓ Barchasi
                  </Button>
                  <Button
                    size="small"
                    style={{ fontSize: 10, height: 20 }}
                    onClick={(e) => { e.stopPropagation(); resetDay(d); }}
                  >
                    ↺ Reset
                  </Button>
                </Space>
              )}
            </div>
          }
        >
          <div
            style={{
              textAlign: "center",
              cursor: "default",
              opacity: weekend ? 0.4 : 1,
              minWidth: 36,
            }}
          >
            <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.2 }}>{dayLabel}</div>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: todayMark ? "#2563eb" : "transparent",
                color: todayMark ? "#fff" : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "2px auto 0",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {d}
            </div>
          </div>
        </Tooltip>
      ),
      dataIndex: `day-${d}`,
      width: 40,
      align: "center" as const,
      onHeaderCell: () => ({
        style: {
          background: todayMark ? "#eff6ff" : weekend ? "#f8fafc" : "#fff",
          padding: "6px 2px",
        },
      }),
      onCell: () => ({
        style: {
          padding: "3px 2px",
          background: todayMark ? "#eff6ff80" : undefined,
        },
      }),
      render: (_: unknown, record: { id: string }) => {
        if (weekend) {
          return (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#f1f5f9",
                margin: "0 auto",
              }}
            />
          );
        }
        const key = dateKey(year, month, d);
        const status: AttendanceStatus = attendance[key]?.[record.id] ?? "none";
        const cfg = STATUS_CONFIG[status];

        return (
          <Tooltip
            title={
              <span>
                <b>{STUDENTS.find((s) => s.id === record.id)?.name}</b>
                <br />
                {MONTHS_UZ[month]} {d}: {cfg.label}
                <br />
                <span style={{ color: "#94a3b8" }}>Bosing → o'zgartiring</span>
              </span>
            }
          >
            <button
              onClick={() => toggle(d, record.id)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${cfg.borderColor}`,
                background: cfg.bgColor,
                color: cfg.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                margin: "0 auto",
                fontSize: 11,
                fontWeight: 700,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {cfg.icon}
            </button>
          </Tooltip>
        );
      },
    };
  });

  const columns = [
    {
      key: "name",
      title: (
        <Space>
          <TeamOutlined style={{ color: "#64748b" }} />
          <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>O'quvchi</Text>
        </Space>
      ),
      dataIndex: "name",
      fixed: "left" as const,
      width: 175,
      render: (name: string, record: { id: string }, index: number) => (
        <Space size={8}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: AVATAR_COLORS[index % AVATAR_COLORS.length],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {STUDENTS.find((s) => s.id === record.id)?.avatar}
          </div>
          <Text style={{ fontSize: 12, fontWeight: 500, maxWidth: 115 }} ellipsis>
            {name}
          </Text>
        </Space>
      ),
    },
    ...dayColumns,
    {
      key: "stats",
      title: (
        <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Natija</Text>
      ),
      fixed: "right" as const,
      width: 100,
      render: (_: unknown, record: { id: string }) => {
        const ss = studentStats(record.id);
        return (
          <div style={{ padding: "0 4px" }}>
            <Space size={4} style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>{ss.p}K</Text>
              <Text style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>{ss.a}X</Text>
              {ss.l > 0 && (
                <Text style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700 }}>{ss.l}!</Text>
              )}
            </Space>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Progress
                percent={ss.rate}
                showInfo={false}
                size="small"
                strokeColor={ss.rate >= 80 ? "#10b981" : ss.rate >= 60 ? "#f59e0b" : "#ef4444"}
                style={{ flex: 1, margin: 0 }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: ss.rate >= 80 ? "#10b981" : ss.rate >= 60 ? "#f59e0b" : "#ef4444",
                  minWidth: 28,
                  textAlign: "right",
                }}
              >
                {ss.rate}%
              </Text>
            </div>
          </div>
        );
      },
    },
  ];

  const tableData = STUDENTS.map((s) => ({ ...s, key: s.id }));

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Davomat
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            O'quvchilar davomatini belgilang
          </Text>
        </div>
        <Space wrap>
          <Select
            value={selectedGroup}
            onChange={setSelectedGroup}
            style={{ width: 176 }}
            size="middle"
          >
            {GROUPS.map((g) => (
              <Option key={g} value={g}>{g}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{
              background: saved ? "#059669" : "#2563eb",
              borderColor: saved ? "#059669" : "#2563eb",
            }}
          >
            {saved ? "Saqlandi!" : "Saqlash"}
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {[
          {
            label: "Dars kunlari",
            value: stats.classDayCount,
            icon: <CalendarOutlined style={{ color: "#3b82f6" }} />,
            iconBg: "#eff6ff",
          },
          {
            label: "Keldi",
            value: stats.totalPresent,
            icon: <CheckOutlined style={{ color: "#10b981" }} />,
            iconBg: "#ecfdf5",
          },
          {
            label: "Kelmadi",
            value: stats.totalAbsent,
            icon: <CloseOutlined style={{ color: "#ef4444" }} />,
            iconBg: "#fef2f2",
          },
          {
            label: "Davomat %",
            value: `${stats.rate}%`,
            icon: <RiseOutlined style={{ color: "#8b5cf6" }} />,
            iconBg: "#f5f3ff",
          },
        ].map((s) => (
          <Col xs={12} sm={6} key={s.label}>
            <Card size="small" bodyStyle={{ padding: "12px 16px" }}>
              <Space size={12} align="center">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: s.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{s.label}</Text>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                    {s.value}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
          Belgilar:
        </Text>
        {(["present", "absent", "late", "none"] as AttendanceStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <Space key={s} size={4} align="center">
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: `1px solid ${cfg.borderColor}`,
                  background: cfg.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: cfg.color,
                }}
              >
                {cfg.short}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {cfg.label}
              </Text>
            </Space>
          );
        })}
        <Text type="secondary" style={{ fontSize: 11, marginLeft: "auto" }}>
          * Katak bosib holat o'zgartiring
        </Text>
      </div>

      {/* Calendar Table */}
      <Card
        bodyStyle={{ padding: 0 }}
        style={{ overflow: "hidden", marginBottom: 16 }}
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={prevMonth}
              size="small"
            />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {MONTHS_UZ[month]} {year}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {selectedGroup}
              </div>
            </div>
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={nextMonth}
              size="small"
            />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: "max-content" }}
          size="small"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "attendance-row-even" : "attendance-row-odd"
          }
          style={{ fontSize: 12 }}
        />
      </Card>

      {/* Bottom Summary */}
      <Row gutter={[12, 12]}>
        {/* Low attendance */}
        <Col xs={24} sm={16}>
          <Card
            size="small"
            title={
              <Space>
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <Text style={{ fontSize: 13, fontWeight: 600 }}>
                  Past davomatli o'quvchilar
                </Text>
              </Space>
            }
          >
            {lowAttendanceStudents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Hamma o'quvchilar yaxshi davomatda ✓
                </Text>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                {lowAttendanceStudents.map((s, i) => {
                  const ss = studentStats(s.id);
                  return (
                    <div
                      key={s.id}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {s.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 12, fontWeight: 500 }} ellipsis>
                          {s.name}
                        </Text>
                        <Progress
                          percent={ss.rate}
                          showInfo={false}
                          size="small"
                          strokeColor="#ef4444"
                          style={{ margin: 0 }}
                        />
                      </div>
                      <Tag
                        color="error"
                        icon={<WarningOutlined />}
                        style={{ fontSize: 10, marginRight: 0 }}
                      >
                        {ss.rate}% Diqqat!
                      </Tag>
                    </div>
                  );
                })}
              </Space>
            )}
          </Card>
        </Col>

        {/* Overall summary */}
        <Col xs={24} sm={8}>
          <Card size="small" title={<Text style={{ fontSize: 13, fontWeight: 600 }}>Oylik Xulosa</Text>}>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {[
                {
                  label: "Umumiy davomat",
                  value: `${stats.rate}%`,
                  color: stats.rate >= 80 ? "#10b981" : "#f59e0b",
                },
                { label: "Jami keldi", value: stats.totalPresent, color: "#10b981" },
                { label: "Kelmadi", value: stats.totalAbsent, color: "#ef4444" },
                { label: "Kech keldi", value: stats.totalLate, color: "#f59e0b" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.label}
                  </Text>
                  <Text
                    style={{ fontSize: 13, fontWeight: 700, color: item.color }}
                  >
                    {item.value}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Inline styles for row striping */}
      <style>{`
        .attendance-row-even td {
          background: #ffffff !important;
        }
        .attendance-row-odd td {
          background: #f8fafc !important;
        }
        .attendance-row-even:hover td,
        .attendance-row-odd:hover td {
          background: #eff6ff !important;
        }
      `}</style>
    </div>
  );
};

export default TeacherAttendance;