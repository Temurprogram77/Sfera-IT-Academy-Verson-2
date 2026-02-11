"use client";

import { Card, Collapse, Tag, Empty, Row, Col } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Column, Line, Pie } from "@ant-design/plots";
import { WeeklyStat, TimeSlot } from "../../types/room";

interface WeeklyAvailabilityProps {
  weeklyStats: WeeklyStat[];
}

const dayNameMap: Record<string, string> = {
  MONDAY: "Dushanba",
  TUESDAY: "Seshanba",
  WEDNESDAY: "Chorshanba",
  THURSDAY: "Payshanba",
  FRIDAY: "Juma",
  SATURDAY: "Shanba",
  SUNDAY: "Yakshanba",
};

const formatTime = (timeStr: string): string => {
  return timeStr.substring(0, 5);
};

const formatTimeRange = (slot: TimeSlot): string => {
  return `${formatTime(slot.start)} - ${formatTime(slot.end)}`;
};

const calculateHours = (timeStr: string): number => {
  const [hours] = timeStr.split(":").map(Number);
  return hours;
};

const getDayColor = (index: number): string => {
  const colors = [
    "blue",
    "cyan",
    "green",
    "orange",
    "red",
    "purple",
    "magenta",
  ];
  return colors[index % colors.length];
};

export default function WeeklyAvailability({
  weeklyStats,
}: WeeklyAvailabilityProps) {
  if (!weeklyStats || weeklyStats.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Empty description="Haftaviy jadval ma'lumotlari mavjud emas" />
      </Card>
    );
  }

  // 🔹 Haftalik umumiy statistika
  const weeklyData = weeklyStats.map((stat) => {
    const busyHours = stat.busy.reduce((acc, slot) => {
      const startHour = calculateHours(slot.start);
      const endHour = calculateHours(slot.end);
      return acc + (endHour - startHour);
    }, 0);

    return {
      day: dayNameMap[stat.day] || stat.day,
      busy: busyHours,
      free: 24 - busyHours,
    };
  });

  // 🔹 Bar chart (Band)
  const columnConfig = {
    data: weeklyData,
    xField: "day",
    yField: "busy",
    height: 250,
    color: "#ff4d4f",
  };

  // 🔹 Line chart (Bo'sh)
  const lineConfig = {
    data: weeklyData,
    xField: "day",
    yField: "free",
    height: 250,
    color: "#52c41a",
    point: { size: 5 },
  };

  const items = weeklyStats.map((stat, index) => {
    const dayName = dayNameMap[stat.day] || stat.day;

    const busyHours = stat.busy.reduce((acc, slot) => {
      const startHour = calculateHours(slot.start);
      const endHour = calculateHours(slot.end);
      return acc + (endHour - startHour);
    }, 0);

    const pieData = [
      { type: "Band", value: busyHours },
      { type: "Bo'sh", value: 24 - busyHours },
    ];

    return {
      key: stat.day,
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="font-semibold">{dayName}</span>
          <div className="flex gap-2">
            <Tag color={getDayColor(index)}>
              Band: {busyHours} soat
            </Tag>
            <Tag color="green">
              Bo'sh: {24 - busyHours} soat
            </Tag>
          </div>
        </div>
      ),
      children: (
        <div className="space-y-6">
          {/* 🔹 Donut chart */}
          <Pie
            data={pieData}
            angleField="value"
            colorField="type"
            innerRadius={0.6}
            height={250}
          />

          {/* Band vaqtlar */}
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <ClockCircleOutlined />
              Band Vaqtlar
            </h4>

            {stat.busy.length > 0 ? (
              <div className="space-y-2">
                {stat.busy.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200"
                  >
                    <div className="w-2 h-8 bg-red-500 rounded"></div>
                    <span className="font-mono text-sm font-semibold">
                      {formatTimeRange(slot)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Band vaqt yo'q</p>
            )}
          </div>

          {/* Bo'sh vaqtlar */}
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <CheckCircleOutlined />
              Bo'sh Vaqtlar
            </h4>

            {stat.free.length > 0 ? (
              <div className="space-y-2">
                {stat.free.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200"
                  >
                    <div className="w-2 h-8 bg-green-500 rounded"></div>
                    <span className="font-mono text-sm font-semibold">
                      {formatTimeRange(slot)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Bo'sh vaqt yo'q</p>
            )}
          </div>
        </div>
      ),
    };
  });

  return (
    <Card className="border-0 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">
        Haftaviy Statistika
      </h2>

      {/* Yuqoridagi umumiy diagrammalar */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} md={12}>
          <Column {...columnConfig} />
        </Col>
        <Col xs={24} md={12}>
          <Line {...lineConfig} />
        </Col>
      </Row>

      {/* Collapse */}
      <Collapse
        accordion
        items={items}
        defaultActiveKey={weeklyStats[0]?.day}
      />
    </Card>
  );
}