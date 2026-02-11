"use client";

<<<<<<< HEAD
import { Card, Collapse, Tag, Empty, Row, Col } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Column, Line, Pie } from '@ant-design/plots'
import { WeeklyStat, TimeSlot } from '../../types/index2'
=======
import { Card, Collapse, Tag, Empty } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { WeeklyStat, TimeSlot } from "../../types/room";
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6

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
  // "12:00:00" -> "12:00"
  return timeStr.substring(0, 5);
};

const formatTimeRange = (slot: TimeSlot): string => {
  return `${formatTime(slot.start)} - ${formatTime(slot.end)}`;
};

const calculateHours = (timeStr: string): number => {
  const [hours] = timeStr.split(":").map(Number);
  return hours;
};

<<<<<<< HEAD
export default function WeeklyAvailability({ weeklyStats }: WeeklyAvailabilityProps) {
=======
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
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
  if (weeklyStats.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Empty description="Haftaviy jadval ma'lumotlari mavjud emas" />
      </Card>
    );
  }
  const weeklyData = weeklyStats.map((stat) => {
    const busyHours = stat.busy.reduce(
      (acc, slot) => acc + (slot.end.hour - slot.start.hour),
      0
    )

    return {
      day: dayNameMap[stat.day] || stat.day,
      busy: busyHours,
      free: 24 - busyHours,
    }
  })
  const columnConfig = {
    data: weeklyData,
    xField: 'day',
    yField: 'busy',
    height: 250,
    color: '#ff4d4f',
  }
  const lineConfig = {
    data: weeklyData,
    xField: 'day',
    yField: 'free',
    height: 250,
    color: '#52c41a',
    point: { size: 5 },
  }

  const items = weeklyStats.map((stat, index) => {
<<<<<<< HEAD
    const busyHours = stat.busy.reduce(
      (acc, slot) => acc + (slot.end.hour - slot.start.hour),
      0
    )

    const pieData = [
      { type: 'Band', value: busyHours },
      { type: 'Bo‘sh', value: 24 - busyHours },
    ]
=======
    const dayName = dayNameMap[stat.day] || stat.day;
    const busyHours = stat.busy.reduce((acc, slot) => {
      const startHour = calculateHours(slot.start);
      const endHour = calculateHours(slot.end);
      return acc + (endHour - startHour);
    }, 0);
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6

    return {
      key: stat.day,
      label: (
<<<<<<< HEAD
        <div className="flex justify-between w-full pr-4">
          <span className="font-semibold">
            {dayNameMap[stat.day] || stat.day}
          </span>
          <Tag color="blue">Band: {busyHours} soat</Tag>
=======
        <div className="flex items-center justify-between w-full pr-4">
          <span className="font-semibold">{dayName}</span>
          <div className="flex gap-2">
            <Tag color={getDayColor(index)}>Band: {busyHours}h</Tag>
            <Tag color="green">Bo'sh: {12 - busyHours}h</Tag>
          </div>
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
        </div>
      ),
      children: (
        <div className="space-y-6">
<<<<<<< HEAD
          <Pie
            data={pieData}
            angleField="value"
            colorField="type"
            innerRadius={0.6}
            height={250}
          />
=======
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <ClockCircleOutlined />
              Band Vaqtlar
            </h4>
<<<<<<< HEAD
            {stat.busy.map((slot, idx) => (
              <div key={idx} className="p-2 bg-red-50 rounded mb-2">
                {formatTime(slot)}
=======
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
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
              </div>
            ))}
          </div>
<<<<<<< HEAD
=======

>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <CheckCircleOutlined />
              Bo'sh Vaqtlar
            </h4>
<<<<<<< HEAD
            {stat.free.map((slot, idx) => (
              <div key={idx} className="p-2 bg-green-50 rounded mb-2">
                {formatTime(slot)}
=======
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
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
              </div>
            ))}
          </div>
        </div>
      ),
    };
  });

  return (
    <Card className="border-0 shadow-sm">
<<<<<<< HEAD
      <h2 className="text-lg font-semibold mb-6">
        Haftaviy Statistika
      </h2>
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} md={12}>
          <Column {...columnConfig} />
        </Col>
        <Col xs={24} md={12}>
          <Line {...lineConfig} />
        </Col>
      </Row>
      <Collapse accordion items={items} defaultActiveKey={[weeklyStats[0]?.day]} />
=======
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Haftaviy Band va Bo'sh Vaqtlar
        </h2>
      </div>
      <Collapse items={items} defaultActiveKey={[weeklyStats[0]?.day]} />
>>>>>>> 7255d39e71032d43d59fd2e2194ccd4fc26aa5e6
    </Card>
  );
}
