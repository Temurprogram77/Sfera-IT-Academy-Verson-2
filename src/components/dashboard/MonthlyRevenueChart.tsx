import React, { useState, useMemo } from "react";
import { Select, Spin, Empty } from "antd";
import { useSchedule } from "../../hooks/useDashboard";
import { GroupEnum, IScheduleGroup } from "../../types/dashboard";

// ─── Konstantalar ─────────────────────────────────────────────────────────────

const TAB_OPTIONS: { label: string; value: GroupEnum }[] = [
  { label: "BARCHA KUNLAR", value: "" },
  { label: "JUFT KUNLAR", value: "JUFT_KUNLAR" },
  { label: "TOQ KUNLAR", value: "TOQ_KUNLAR" },
  { label: "BOSHQA", value: "BOSHQA_KUNLAR" },
];

const TIME_STEP_OPTIONS = [
  { label: "30 Daqiqa", value: 30 },
  { label: "15 Daqiqa", value: 15 },
  { label: "1 Soat", value: 60 },
];

// Jadval boshlanish/tugash soatlari
const DAY_START = 8; // 08:00
const DAY_END = 20; // 20:00

// Har bir guruh uchun rang — index bo'yicha aylanadi
const GROUP_COLORS = [
  { bg: "#17B26A", text: "#fff" }, // yashil
  { bg: "#155EEF", text: "#fff" }, // ko'k
  { bg: "#F04438", text: "#fff" }, // qizil
  { bg: "#EAB308", text: "#fff" }, // sariq
  { bg: "#7B61FF", text: "#fff" }, // binafsha
  { bg: "#0BA5EC", text: "#fff" }, // moviy
];

// ─── Yordamchi funksiyalar ────────────────────────────────────────────────────

// "HH:mm" → daqiqaga o'girish (kunning boshidan)
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Daqiqadan "HH:mm" ga
const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Vaqt ustunlarini yaratish
const buildTimeSlots = (stepMinutes: number): string[] => {
  const slots: string[] = [];
  for (let m = DAY_START * 60; m <= DAY_END * 60; m += stepMinutes) {
    slots.push(minutesToTime(m));
  }
  return slots;
};

// ─── ScheduleBlock ────────────────────────────────────────────────────────────
interface ScheduleBlockProps {
  group: IScheduleGroup;
  colorIndex: number;
  leftPercent: number;
  widthPercent: number;
}

const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  group,
  colorIndex,
  leftPercent,
  widthPercent,
}) => {
  const color = GROUP_COLORS[colorIndex % GROUP_COLORS.length];

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: "4px",
        bottom: "4px",
        background: color.bg,
        borderRadius: 6,
        padding: "4px 6px",
        color: color.text,
        fontSize: 11,
        fontWeight: 600,
        overflow: "hidden",
        cursor: "default",
        zIndex: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
      }}
      title={`${group.groupName}\n${group.teacherName}\n${group.startTime} - ${group.endTime}`}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "14px",
        }}
      >
        {group.startTime} - {group.endTime} / {group.groupName}
      </span>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 10,
          opacity: 0.9,
          lineHeight: "13px",
        }}
      >
        O'qituvchi: {group.teacherName}
      </span>
    </div>
  );
};

// ─── Asosiy Component ─────────────────────────────────────────────────────────
export default function ScheduleChart() {
  const [activeTab, setActiveTab] = useState<GroupEnum>("JUFT_KUNLAR");
  const [stepMinutes, setStepMinutes] = useState<number>(30);

  const { rooms, loading } = useSchedule(activeTab);

  // Vaqt ustunlari
  const timeSlots = useMemo(() => buildTimeSlots(stepMinutes), [stepMinutes]);

  const totalMinutes = (DAY_END - DAY_START) * 60;

  // Blok pozitsiyasini hisoblash
  const getBlockStyle = (
    startTime: string,
    endTime: string,
  ): { leftPercent: number; widthPercent: number } => {
    const startMin = timeToMinutes(startTime) - DAY_START * 60;
    const endMin = timeToMinutes(endTime) - DAY_START * 60;
    const leftPercent = (startMin / totalMinutes) * 100;
    const widthPercent = ((endMin - startMin) / totalMinutes) * 100;
    return { leftPercent, widthPercent };
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
      className="dark:bg-white/[0.03] dark:border-gray-800"
    >
      {/* ── Header: tablar + vaqt oralig'i ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px 0",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        {/* Tablar */}
        <div style={{ display: "flex", gap: 0 }}>
          {TAB_OPTIONS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#155EEF" : "#6b7280",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid #155EEF"
                    : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  marginBottom: -1,
                  letterSpacing: 0.3,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Vaqt oralig'i dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingBottom: 12,
          }}
        >
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Vaqt oralig'i</span>
          <Select
            value={stepMinutes}
            onChange={setStepMinutes}
            options={TIME_STEP_OPTIONS}
            size="small"
            style={{ width: 120 }}
          />
        </div>
      </div>

      {/* ── Jadval tanasi ── */}
      <div style={{ overflowX: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Spin size="large" />
          </div>
        ) : rooms.length === 0 ? (
          <div style={{ padding: "60px 20px" }}>
            <Empty description="Jadval ma'lumotlari topilmadi" />
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: 900,
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            {/* ── Ustun kengliklari ── */}
            <colgroup>
              {/* Xona nomi ustuni */}
              <col style={{ width: 110 }} />
              {/* Vaqt ustunlari */}
              {timeSlots.map((_, i) => (
                <col key={i} style={{ width: `${100 / timeSlots.length}%` }} />
              ))}
            </colgroup>

            {/* ── Sarlavha qatori ── */}
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    textAlign: "left",
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                    borderRight: "1px solid #e5e7eb",
                    whiteSpace: "nowrap",
                  }}
                >
                  Xonalar / Soat
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={slot}
                    style={{
                      padding: "8px 4px",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#6b7280",
                      textAlign: "left",
                      background: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                      borderRight: "1px solid #f3f4f6",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Xona satrlari ── */}
            <tbody>
              {rooms.map((room, roomIdx) => (
                <tr
                  key={roomIdx}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  {/* Xona nomi */}
                  <td
                    style={{
                      padding: "8px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      borderRight: "1px solid #e5e7eb",
                      whiteSpace: "nowrap",
                      verticalAlign: "middle",
                    }}
                  >
                    {room.roomName}
                  </td>

                  {/* Vaqt katakchalari — bitta katta position:relative cell */}
                  <td
                    colSpan={timeSlots.length}
                    style={{
                      padding: 0,
                      position: "relative",
                      height: 56,
                    }}
                  >
                    {/* Vertikal chiziqlar (vaqt ajratuvchi) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        pointerEvents: "none",
                      }}
                    >
                      {timeSlots.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            borderRight: "1px solid #f3f4f6",
                          }}
                        />
                      ))}
                    </div>

                    {/* Guruh bloklari */}
                    {room.groups.map((group, groupIdx) => {
                      const { leftPercent, widthPercent } = getBlockStyle(
                        group.startTime,
                        group.endTime,
                      );
                      // Har bir xonadagi guruh uchun rang
                      const colorIndex = groupIdx;

                      return (
                        <ScheduleBlock
                          key={groupIdx}
                          group={group}
                          colorIndex={colorIndex}
                          leftPercent={leftPercent}
                          widthPercent={widthPercent}
                        />
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
