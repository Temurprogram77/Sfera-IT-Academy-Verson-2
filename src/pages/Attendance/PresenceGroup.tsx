// pages/Attendance/PresenceGroup.tsx

import { useState, useMemo, useEffect } from "react";
import {
  Spin,
  Modal,
  Input,
  Tooltip,
  Badge,
  Segmented,
  Breadcrumb,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  LockOutlined,
  WifiOutlined,
  DisconnectOutlined,
  FireOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { toast } from "sonner";
import { useGroups, useGroupDetails } from "../../hooks/useGroups";
import { createSSE } from "../../services/sseService";
import { apiClient } from "../../lib/api/client";

dayjs.extend(isoWeek);

const STATUS_CONFIG = {
  KELDI: {
    icon: <CheckCircleFilled style={{ fontSize: 20, color: "#22c55e" }} />,
    label: "Keldi",
    color: "#22c55e",
  },
  KELMADI: {
    icon: <CloseCircleFilled style={{ fontSize: 20, color: "#ef4444" }} />,
    label: "Kelmadi",
    color: "#ef4444",
  },
  SABABLI: {
    icon: <ExclamationCircleFilled style={{ fontSize: 20, color: "#f59e0b" }} />,
    label: "Sababli",
    color: "#f59e0b",
  },
};

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];
const UZ_DAYS_SHORT = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

interface AttendanceRecord {
  studentId: number;
  status: "KELDI" | "KELMADI" | "SABABLI";
  description?: string | null;
  date: string;
  id?: number;
}

export default function PresenceGroup() {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month());
  const [viewMode, setViewMode] = useState<"week" | "month">("month");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingCell, setLoadingCell] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const [pickerModal, setPickerModal] = useState<{
    open: boolean;
    studentId: number;
    date: string;
    studentName: string;
    dateLabel: string;
    isToday: boolean;
  } | null>(null);

  const [descModal, setDescModal] = useState<{
    open: boolean;
    studentId: number;
    date: string;
    status: "KELMADI" | "SABABLI";
    studentName: string;
  } | null>(null);

  const [description, setDescription] = useState("");
  const [descLoading, setDescLoading] = useState(false);

  const { groups, loading: groupsLoading } = useGroups({ page: 0, size: 100 });
  const { students, loading: studentsLoading } = useGroupDetails(selectedGroupId ?? 0);

  // Birinchi guruhni avtomatik tanlash
  useEffect(() => {
    if (groups?.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups]);

  // SSE real-time yangilanish
  useEffect(() => {
    if (!selectedGroupId) return;

    const sse = createSSE({
      url: `${import.meta.env.VITE_API_BASE_URL}/attendance/stream/${selectedGroupId}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => {
        setAttendance(data);
        setConnected(true);
      },
      onError: () => {
        toast.error("Real-time ulanishda xato");
        setConnected(false);
      },
      onOpen: () => setConnected(true),
    });

    return () => {
      sse.close();
      setConnected(false);
    };
  }, [selectedGroupId]);

  const today = useMemo(() => dayjs(), []);
  const todayStr = today.format("YYYY-MM-DD");

  const days = useMemo(() => {
    if (viewMode === "week") {
      const monday = today.isoWeekday(1);
      return Array.from({ length: 7 }, (_, i) => monday.add(i, "day"));
    }
    const start = dayjs(new Date(year, month, 1)).startOf("month");
    const end = start.endOf("month");
    const list: dayjs.Dayjs[] = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      list.push(current);
      current = current.add(1, "day");
    }
    return list;
  }, [viewMode, year, month, today]);

  const getStatus = (studentId: number, dateStr: string) =>
    attendance.find((a) => a.studentId === studentId && a.date === dateStr)?.status;

  const getRecord = (studentId: number, dateStr: string) =>
    attendance.find((a) => a.studentId === studentId && a.date === dateStr);

  const sendAttendance = async (
    studentId: number,
    date: string,
    status: "KELDI" | "KELMADI" | "SABABLI",
    desc: string | null = null
  ) => {
    if (!selectedGroupId) return;
    const key = `${studentId}-${date}`;
    setLoadingCell(key);
    try {
      await apiClient.post(`/attendance?groupId=${selectedGroupId}`, [
        {
          studentId,
          status,
          description: status === "KELDI" ? null : desc,
          date,
        },
      ]);
      toast.success("Saqlandi");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoadingCell(null);
    }
  };

  const handleDeleteCell = (
  e: React.MouseEvent,
  studentId: number,
  date: string
) => {
  e.stopPropagation();
  const record = getRecord(studentId, date);
  if (!record?.id) return;

  Modal.confirm({
    title: "Davomatni o'chirish",
    content: "Bu yozuvni o'chirmoqchimisiz?",
    okText: "O'chirish",
    cancelText: "Bekor",
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      try {
        // To'g'ri API url
        await apiClient.delete(`/attendance/attendanceId?attendanceId=${record.id}`);
        toast.success("O'chirildi");
        // Agar xohlasangiz state'ni ham yangilash mumkin
        setAttendance(prev => prev.filter(a => a.id !== record.id));
      } catch {
        toast.error("O'chirishda xatolik");
      }
    },
  });
};
  const openPicker = (studentId: number, studentName: string, day: dayjs.Dayjs) => {
    if (day.isAfter(today, "day")) return;
    setPickerModal({
      open: true,
      studentId,
      date: day.format("YYYY-MM-DD"),
      studentName,
      dateLabel: day.format("D MMM"),
      isToday: day.isSame(today, "day"),
    });
  };

  const handleStatusSelect = (status: "KELDI" | "KELMADI" | "SABABLI") => {
    if (!pickerModal) return;
    if (status === "KELDI") {
      sendAttendance(pickerModal.studentId, pickerModal.date, "KELDI");
      setPickerModal(null);
    } else {
      setPickerModal(null);
      setDescription("");
      setDescModal({
        open: true,
        studentId: pickerModal.studentId,
        date: pickerModal.date,
        status,
        studentName: pickerModal.studentName,
      });
    }
  };

  const handleDescSave = async () => {
    if (!descModal || !description.trim()) {
      toast.warning("Sabab kiriting");
      return;
    }
    setDescLoading(true);
    await sendAttendance(descModal.studentId, descModal.date, descModal.status, description.trim());
    setDescLoading(false);
    setDescModal(null);
    setDescription("");
  };

  const unmarkedToday = students.filter((s: any) => {
    const sid = s.id ?? s.studentId;
    return !getStatus(sid, todayStr);
  });

  if (groupsLoading || studentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const selectedGroup = groups.find((g: any) => g.id === selectedGroupId);

  const nameCol = 190;
  const dayCol = viewMode === "week" ? 68 : 42;
  const statsCol = 150;

  // ─── Cell component ────────────────────────────────────────────
  const Cell = ({ student, day }: { student: any; day: dayjs.Dayjs }) => {
    const sid = student.id ?? student.studentId;
    const name = student.fulName || student.fullName || "—";
    const dateStr = day.format("YYYY-MM-DD");
    const isFuture = day.isAfter(today, "day");
    const isTodayCell = day.isSame(today, "day");
    const isWeekend = day.day() === 0 || day.day() === 6;
    const status = getStatus(sid, dateStr);
    const record = getRecord(sid, dateStr);
    const isLoading = loadingCell === `${sid}-${dateStr}`;

    let bgClass = "";
    if (status === "KELDI") bgClass = "bg-green-50 dark:bg-green-900/20";
    else if (status === "KELMADI") bgClass = "bg-red-50 dark:bg-red-900/20";
    else if (status === "SABABLI") bgClass = "bg-yellow-50 dark:bg-yellow-900/20";
    else if (isTodayCell) bgClass = "ring-1 ring-inset ring-[#00A67D]/40 bg-[#00A67D]/5";
    else if (isWeekend) bgClass = "bg-red-50/30 dark:bg-red-900/5";

    return (
      <Tooltip
        title={
          isFuture
            ? "Kelajak sana"
            : status
            ? `${STATUS_CONFIG[status].label}${record?.description ? ` — ${record.description}` : ""}`
            : isTodayCell
            ? "Bugun — bosib belgilang"
            : "Belgilash uchun bosing"
        }
        mouseEnterDelay={0.4}
      >
        <div
          onClick={() => !isFuture && openPicker(sid, name, day)}
          className={[
            "flex items-center justify-center border-r border-gray-100 dark:border-gray-700/50 transition-all duration-150 relative",
            viewMode === "week" ? "h-12" : "h-10",
            isFuture ? "cursor-default" : "cursor-pointer",
            bgClass,
            !isFuture && !status ? "hover:bg-gray-100 dark:hover:bg-gray-700/40" : "",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#00A67D] border-t-transparent rounded-full animate-spin" />
          ) : isFuture ? (
            <LockOutlined style={{ fontSize: 11, color: "#d1d5db" }} />
          ) : status ? (
            <div className="relative group/cell w-full h-full flex items-center justify-center">
              {STATUS_CONFIG[status].icon}
              {record?.id && (
                <button
                  onClick={(e) => handleDeleteCell(e, sid, dateStr)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity bg-white/85 dark:bg-gray-800/85"
                >
                  <DeleteOutlined style={{ fontSize: 13, color: "#ef4444" }} />
                </button>
              )}
            </div>
          ) : isTodayCell ? (
            <span className="w-2 h-2 rounded-full bg-[#00A67D]/60 animate-pulse" />
          ) : (
            <span className="text-gray-200 dark:text-gray-600 select-none text-sm">—</span>
          )}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-4"
          items={[
            {
              title: (
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-1.5 text-[#00A67D] font-medium hover:opacity-80 transition-opacity"
                >
                  <ArrowLeftOutlined style={{ fontSize: 12 }} />
                  Davomat
                </button>
              ),
            },
            { title: selectedGroup?.name || "Guruh" },
          ]}
        />

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedGroup?.name || "Davomat"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>{students.length} o'quvchi</span>
                {viewMode === "month" ? (
                  <span>{MONTHS_UZ[month]} {year}</span>
                ) : (
                  <span>
                    {days[0].format("D MMM")} – {days[6].format("D MMM YYYY")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* SSE status */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  connected
                    ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700"
                }`}
              >
                {connected ? (
                  <>
                    <WifiOutlined />
                    <span>Real-time</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </>
                ) : (
                  <>
                    <DisconnectOutlined />
                    <span>Ulanmoqda...</span>
                  </>
                )}
              </div>

              <Segmented
                value={viewMode}
                onChange={(v) => setViewMode(v as "week" | "month")}
                options={[
                  { value: "month", label: "Oy" },
                  { value: "week", label: "Hafta" },
                ]}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
              <div key={k} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                {cfg.icon}
                <span>{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#00A67D]/60 inline-block" />
              <span>Bugun (belgilanmagan)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <LockOutlined style={{ fontSize: 12, color: "#d1d5db" }} />
              <span>Kelajak</span>
            </div>
          </div>
        </div>

        {/* Bugun belgilanmaganlar banner */}
        {unmarkedToday.length > 0 && (
          <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <FireOutlined />
              <span className="text-sm font-semibold">
                Bugun {today.format("D MMMM")} —{" "}
                <span className="font-bold">{unmarkedToday.length} ta</span> o'quvchi belgilanmagan
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {unmarkedToday.slice(0, 6).map((s: any) => (
                <button
                  key={s.id ?? s.studentId}
                  onClick={() => openPicker(s.id ?? s.studentId, s.fulName || s.fullName || "", today)}
                  className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-600 rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors font-medium max-w-[150px] truncate"
                >
                  {s.fulName || s.fullName || "—"}
                </button>
              ))}
              {unmarkedToday.length > 6 && (
                <span className="text-xs text-amber-600 py-1">
                  +{unmarkedToday.length - 6} ta
                </span>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${nameCol + days.length * dayCol + statsCol}px` }}>

              {/* Header */}
              <div
                className="grid sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-700"
                style={{
                  gridTemplateColumns: `${nameCol}px repeat(${days.length}, ${dayCol}px) ${statsCol}px`,
                }}
              >
                <div className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-r border-gray-100 dark:border-gray-700">
                  O'quvchi
                </div>

                {days.map((day) => {
                  const isTodayCol = day.isSame(today, "day");
                  const isWeekend = day.day() === 0 || day.day() === 6;
                  return (
                    <div
                      key={day.valueOf()}
                      className={[
                        "py-2 text-center border-r border-gray-100 dark:border-gray-700",
                        isTodayCol
                          ? "bg-[#00A67D]/10"
                          : isWeekend
                          ? "bg-red-50/40 dark:bg-red-900/10"
                          : "",
                      ].join(" ")}
                    >
                      {viewMode === "week" ? (
                        <>
                          <div
                            className={`text-[10px] font-medium leading-tight ${
                              isWeekend && !isTodayCol
                                ? "text-red-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {UZ_DAYS_SHORT[day.day()]}
                          </div>
                          <div
                            className={[
                              "text-sm font-bold leading-tight mt-0.5 w-7 h-7 flex items-center justify-center rounded-full mx-auto",
                              isTodayCol
                                ? "bg-[#00A67D] text-white"
                                : isWeekend
                                ? "text-red-400"
                                : "text-gray-700 dark:text-gray-300",
                            ].join(" ")}
                          >
                            {day.format("D")}
                          </div>
                        </>
                      ) : (
                        <div
                          className={[
                            "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mx-auto",
                            isTodayCol
                              ? "bg-[#00A67D] text-white"
                              : isWeekend
                              ? "text-red-400"
                              : "text-gray-600 dark:text-gray-400",
                          ].join(" ")}
                        >
                          {day.format("D")}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                  Natija
                </div>
              </div>

              {/* Rows */}
              {students.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                  O'quvchilar yo'q
                </div>
              ) : (
                students.map((student: any, idx: number) => {
                  const sid = student.id ?? student.studentId;
                  const name = student.fulName || student.fullName || "—";
                  const todayStatus = getStatus(sid, todayStr);

                  const pastDays = days.filter((d) => !d.isAfter(today, "day"));
                  const keldi = pastDays.filter(
                    (d) => getStatus(sid, d.format("YYYY-MM-DD")) === "KELDI"
                  ).length;
                  const kelmadi = pastDays.filter(
                    (d) => getStatus(sid, d.format("YYYY-MM-DD")) === "KELMADI"
                  ).length;
                  const sababli = pastDays.filter(
                    (d) => getStatus(sid, d.format("YYYY-MM-DD")) === "SABABLI"
                  ).length;
                  const rate =
                    pastDays.length > 0
                      ? Math.round((keldi / pastDays.length) * 100)
                      : null;

                  return (
                    <div
                      key={sid}
                      className="grid border-b border-gray-50 dark:border-gray-700/40 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                      style={{
                        gridTemplateColumns: `${nameCol}px repeat(${days.length}, ${dayCol}px) ${statsCol}px`,
                      }}
                    >
                      {/* Name column */}
                      <div className="px-3 py-2 flex items-center gap-2 border-r border-gray-100 dark:border-gray-700 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500 font-semibold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <Tooltip
                          title={
                            todayStatus
                              ? `Bugun: ${STATUS_CONFIG[todayStatus].label}`
                              : "Bugun belgilanmagan"
                          }
                        >
                          <span
                            className={[
                              "w-2 h-2 rounded-full flex-shrink-0 cursor-default",
                              todayStatus === "KELDI"
                                ? "bg-green-400"
                                : todayStatus === "KELMADI"
                                ? "bg-red-400"
                                : todayStatus === "SABABLI"
                                ? "bg-yellow-400"
                                : "bg-gray-200 dark:bg-gray-600",
                            ].join(" ")}
                          />
                        </Tooltip>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {name}
                        </span>
                      </div>

                      {/* Day cells */}
                      {days.map((day) => (
                        <Cell key={day.valueOf()} student={student} day={day} />
                      ))}

                      {/* Stats */}
                      <div className="px-2 py-2 flex items-center justify-center gap-1 flex-wrap">
                        <Tooltip title="Keldi">
                          <Badge
                            count={keldi}
                            showZero
                            style={{
                              backgroundColor: "#22c55e",
                              fontSize: 10,
                              minWidth: 18,
                              height: 18,
                              lineHeight: "18px",
                              padding: "0 5px",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Kelmadi">
                          <Badge
                            count={kelmadi}
                            showZero
                            style={{
                              backgroundColor: "#ef4444",
                              fontSize: 10,
                              minWidth: 18,
                              height: 18,
                              lineHeight: "18px",
                              padding: "0 5px",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Sababli">
                          <Badge
                            count={sababli}
                            showZero
                            style={{
                              backgroundColor: "#f59e0b",
                              fontSize: 10,
                              minWidth: 18,
                              height: 18,
                              lineHeight: "18px",
                              padding: "0 5px",
                            }}
                          />
                        </Tooltip>
                        {rate !== null && (
                          <span
                            className="text-xs font-bold ml-0.5"
                            style={{
                              color:
                                rate >= 80
                                  ? "#22c55e"
                                  : rate >= 60
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          >
                            {rate}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Status Picker Modal ──────────────────────────────────── */}
      <Modal
        open={!!pickerModal?.open}
        onCancel={() => setPickerModal(null)}
        footer={null}
        title={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white">
              {pickerModal?.studentName}
            </span>
            <span
              className={[
                "text-xs px-2 py-0.5 rounded-full font-medium",
                pickerModal?.isToday
                  ? "bg-[#00A67D]/10 text-[#00A67D]"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500",
              ].join(" ")}
            >
              {pickerModal?.isToday ? "🔥 Bugun" : pickerModal?.dateLabel}
            </span>
          </div>
        }
        width={320}
        centered
      >
        <p className="text-sm text-gray-500 mb-4 mt-1">Davomatni tanlang:</p>
        <div className="grid grid-cols-3 gap-3">
          {(["KELDI", "KELMADI", "SABABLI"] as const).map((status) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                className={[
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 hover:shadow-md",
                  status === "KELDI"
                    ? "border-green-100 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : status === "KELMADI"
                    ? "border-red-100 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "border-yellow-100 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
                ].join(" ")}
              >
                {cfg.icon}
                <span className="text-sm font-semibold" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* ─── Description Modal ────────────────────────────────────── */}
      <Modal
        open={!!descModal?.open}
        onCancel={() => {
          setDescModal(null);
          setDescription("");
        }}
        onOk={handleDescSave}
        okText="Saqlash"
        cancelText="Bekor"
        confirmLoading={descLoading}
        okButtonProps={{
          disabled: !description.trim(),
          style: {
            backgroundColor: descModal?.status === "KELMADI" ? "#ef4444" : "#f59e0b",
            borderColor: descModal?.status === "KELMADI" ? "#ef4444" : "#f59e0b",
          },
        }}
        title={
          <div className="flex items-center gap-2">
            {descModal?.status === "KELMADI" ? (
              <CloseCircleFilled style={{ color: "#ef4444", fontSize: 16 }} />
            ) : (
              <ExclamationCircleFilled style={{ color: "#f59e0b", fontSize: 16 }} />
            )}
            <span className="font-semibold">
              {descModal?.status === "KELMADI" ? "Kelmadi" : "Sababli"} —{" "}
              {descModal?.studentName}
            </span>
          </div>
        }
        centered
        width={420}
      >
        <p className="text-sm text-gray-500 mb-3">Sabab yoki izoh kiriting:</p>
        <Input.TextArea
          className="mb-3!"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Masalan: Kasal, Chempionat, Oilaviy sabab..."
          maxLength={200}
          showCount
          autoFocus
        />
      </Modal>
    </div>
  );
}