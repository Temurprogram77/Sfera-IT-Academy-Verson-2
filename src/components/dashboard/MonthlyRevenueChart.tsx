import React, { useState, useMemo } from "react";
import { Select, Spin, Empty } from "antd";
import { useSchedule } from "../../hooks/useDashboard";
import { GroupEnum, IScheduleGroup } from "../../types/dashboard";

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

const DAY_START = 8;
const DAY_END = 20;

const GROUP_COLORS = [
  { bg: "#17B26A", text: "#fff" },
  { bg: "#155EEF", text: "#fff" },
  { bg: "#F04438", text: "#fff" },
  { bg: "#EAB308", text: "#fff" },
  { bg: "#7B61FF", text: "#fff" },
  { bg: "#0BA5EC", text: "#fff" },
];

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const buildTimeSlots = (stepMinutes: number): string[] => {
  const slots: string[] = [];
  for (let m = DAY_START * 60; m <= DAY_END * 60; m += stepMinutes) {
    slots.push(minutesToTime(m));
  }
  return slots;
};

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
        borderRadius: 8,
        padding: "4px 6px",
        color: color.text,
        fontSize: 11,
        fontWeight: 600,
        overflow: "hidden",
        cursor: "default",
        zIndex: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      title={`${group.groupName}\n${group.teacherName}\n${group.startTime} - ${group.endTime}`}
    >
      <span className="truncate">
        {group.startTime} - {group.endTime} / {group.groupName}
      </span>
      <span className="truncate text-[10px] opacity-90">
        O'qituvchi: {group.teacherName}
      </span>
    </div>
  );
};

export default function ScheduleChart() {
  const [activeTab, setActiveTab] = useState<GroupEnum>("JUFT_KUNLAR");
  const [stepMinutes, setStepMinutes] = useState<number>(30);
  const { rooms, loading } = useSchedule(activeTab);

  const timeSlots = useMemo(() => buildTimeSlots(stepMinutes), [stepMinutes]);
  const totalMinutes = (DAY_END - DAY_START) * 60;

  const getBlockStyle = (startTime: string, endTime: string) => {
    const startMin = timeToMinutes(startTime) - DAY_START * 60;
    const endMin = timeToMinutes(endTime) - DAY_START * 60;
    return {
      leftPercent: (startMin / totalMinutes) * 100,
      widthPercent: ((endMin - startMin) / totalMinutes) * 100,
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-colors">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-4 border-b border-gray-200 dark:border-gray-700">

        <div className="flex">
          {TAB_OPTIONS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 text-sm transition-all border-b-2
                  ${isActive
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 font-semibold"
                    : "text-gray-500 dark:text-gray-400 border-transparent"}
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Vaqt oralig'i
          </span>
          <Select
            value={stepMinutes}
            onChange={setStepMinutes}
            options={TIME_STEP_OPTIONS}
            size="small"
            className="w-[120px]"
          />
        </div>
      </div>

      {/* BODY */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-16">
            <Spin size="large" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-16">
            <Empty description="Jadval ma'lumotlari topilmadi" />
          </div>
        ) : (
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <colgroup>
              <col style={{ width: 110 }} />
              {timeSlots.map((_, i) => (
                <col key={i} style={{ width: `${100 / timeSlots.length}%` }} />
              ))}
            </colgroup>

            <thead>
              <tr>
                <th className="px-3 py-2 text-xs font-semibold text-left bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-r border-gray-200 dark:border-gray-700">
                  Xonalar / Soat
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={slot}
                    className="px-2 py-2 text-[11px] font-medium text-left bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rooms.map((room, roomIdx) => (
                <tr key={roomIdx} className="border-b border-gray-100 dark:border-gray-800">

                  <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 whitespace-nowrap">
                    {room.roomName}
                  </td>

                  <td colSpan={timeSlots.length} className="relative h-14 p-0">

                    {/* Vertical grid */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {timeSlots.map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 border-r border-gray-100 dark:border-gray-800"
                        />
                      ))}
                    </div>

                    {/* Blocks */}
                    {room.groups.map((group, groupIdx) => {
                      const { leftPercent, widthPercent } =
                        getBlockStyle(group.startTime, group.endTime);

                      return (
                        <ScheduleBlock
                          key={groupIdx}
                          group={group}
                          colorIndex={groupIdx}
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
