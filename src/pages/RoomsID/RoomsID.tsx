'use client'

import { Layout, Tabs, Spin, Alert } from 'antd'
import { useParams } from 'react-router-dom'
import RoomInfo from '../../components/rooms/RoomInfo'
import ScheduleList from '../../components/rooms/ScheduleLists'
import WeeklyAvailability from '../../components/rooms/WeeklyStatisticsDashboard'
import { useRoomId } from '../../hooks/useRoomsId'

const { Content } = Layout

export default function Page() {
  const params = useParams()
  const roomId = params.id as string

  const { room, loading, error } = useRoomId(roomId)

  if (loading) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-8 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto flex justify-center items-center min-h-[400px]">
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    )
  }

  if (error || !room) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-8">
          <div className="max-w-6xl mx-auto">
            <Alert
              message="Xatolik"
              description={error || "Xona topilmadi"}
              type="error"
              showIcon
            />
          </div>
        </Content>
      </Layout>
    )
  }

  const items = [
    {
      key: 'info',
      label: "Xona Ma'lumotlari",
      children: <RoomInfo room={room} />,
    },
    {
      key: 'schedule',
      label: 'Xonadagi Guruhlar',
      children: <ScheduleList schedules={room.schedules || []} />,
    },
    {
      key: 'availability',
      label: "Haftaviy Band/Bo'sh Vaqtlar",
      children: <WeeklyAvailability weeklyStats={room.weeklyStats || []} />,
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Content className="p-8 bg-[#fff]">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultActiveKey="info" items={items} />
        </div>
      </Content>
    </Layout>
  )
}