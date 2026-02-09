'use client'

import { Layout, Tabs } from 'antd'
import RoomInfo from '../../components/rooms/RoomINfo'
import ScheduleList from '../../components/rooms/ScheduleLists'
import WeeklyAvailability from '../../components/rooms/WeeklyAvailability'
import { RoomData } from '../../types/index2'

const { Content } = Layout

const roomData: RoomData = {
  id: 1,
  name: "ChatGpt Xonasi",
  schedules: [
    {
      id: 1,
      name: "Web Dasturlash",
      startTime: "09:00",
      endTime: "11:00",
      weekDays: ["MONDAY", "WEDNESDAY", "FRIDAY"],
      teacherId: 1,
      categoryId: 1,
      roomId: 1,
    },
    {
      id: 2,
      name: "Mobil Ilovalar",
      startTime: "11:30",
      endTime: "13:30",
      weekDays: ["TUESDAY", "THURSDAY"],
      teacherId: 2,
      categoryId: 2,
      roomId: 1,
    },
    {
      id: 3,
      name: "Database Asoslari",
      startTime: "14:00",
      endTime: "16:00",
      weekDays: ["MONDAY", "WEDNESDAY"],
      teacherId: 3,
      categoryId: 3,
      roomId: 1,
    },
  ],
  weeklyStats: [
    {
      day: "MONDAY",
      busy: [
        { start: { hour: 9, minute: 0, second: 0, nano: 0 }, end: { hour: 11, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 14, minute: 0, second: 0, nano: 0 }, end: { hour: 16, minute: 0, second: 0, nano: 0 } },
      ],
      free: [
        { start: { hour: 0, minute: 0, second: 0, nano: 0 }, end: { hour: 9, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 11, minute: 0, second: 0, nano: 0 }, end: { hour: 14, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 16, minute: 0, second: 0, nano: 0 }, end: { hour: 23, minute: 59, second: 59, nano: 0 } },
      ],
    },
    {
      day: "TUESDAY",
      busy: [
        { start: { hour: 11, minute: 30, second: 0, nano: 0 }, end: { hour: 13, minute: 30, second: 0, nano: 0 } },
      ],
      free: [
        { start: { hour: 0, minute: 0, second: 0, nano: 0 }, end: { hour: 11, minute: 30, second: 0, nano: 0 } },
        { start: { hour: 13, minute: 30, second: 0, nano: 0 }, end: { hour: 23, minute: 59, second: 59, nano: 0 } },
      ],
    },
    {
      day: "WEDNESDAY",
      busy: [
        { start: { hour: 9, minute: 0, second: 0, nano: 0 }, end: { hour: 11, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 14, minute: 0, second: 0, nano: 0 }, end: { hour: 16, minute: 0, second: 0, nano: 0 } },
      ],
      free: [
        { start: { hour: 0, minute: 0, second: 0, nano: 0 }, end: { hour: 9, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 11, minute: 0, second: 0, nano: 0 }, end: { hour: 14, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 16, minute: 0, second: 0, nano: 0 }, end: { hour: 23, minute: 59, second: 59, nano: 0 } },
      ],
    },
    {
      day: "THURSDAY",
      busy: [
        { start: { hour: 11, minute: 30, second: 0, nano: 0 }, end: { hour: 13, minute: 30, second: 0, nano: 0 } },
      ],
      free: [
        { start: { hour: 0, minute: 0, second: 0, nano: 0 }, end: { hour: 11, minute: 30, second: 0, nano: 0 } },
        { start: { hour: 13, minute: 30, second: 0, nano: 0 }, end: { hour: 23, minute: 59, second: 59, nano: 0 } },
      ],
    },
    {
      day: "FRIDAY",
      busy: [
        { start: { hour: 9, minute: 0, second: 0, nano: 0 }, end: { hour: 11, minute: 0, second: 0, nano: 0 } },
      ],
      free: [
        { start: { hour: 0, minute: 0, second: 0, nano: 0 }, end: { hour: 9, minute: 0, second: 0, nano: 0 } },
        { start: { hour: 11, minute: 0, second: 0, nano: 0 }, end: { hour: 23, minute: 59, second: 59, nano: 0 } },
      ],
    },
  ],
}

const items = [
  {
    key: 'info',
    label: 'Xona Ma\'lumotlari',
    children: <RoomInfo room={roomData} />,
  },
  {
    key: 'schedule',
    label: 'Jadval (Jadvallashtirilgan Guruhlar)',
    children: <ScheduleList schedules={roomData.schedules} />,
  },
  {
    key: 'availability',
    label: 'Haftaviy Band/Bo\'sh Vaqtlar',
    children: <WeeklyAvailability weeklyStats={roomData.weeklyStats} />,
  },
]

export default function Page() {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultActiveKey="info" items={items} />
        </div>
      </Content>
    </Layout>
  )
}
