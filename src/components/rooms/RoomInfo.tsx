'use client'

import { Card, Row, Col, Statistic,  } from 'antd'
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Room } from '../../types/room'

interface RoomInfoProps {
  room: Room
}

export default function RoomInfo({ room }: RoomInfoProps) {
  const totalSchedules = room.schedules?.length || 0
  const daysWithSchedules = new Set(
    (room.schedules || []).flatMap((s) => s.weekDays)
  ).size

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold m-0">{room.name}</h1>
          </div>
        </div>

        <Row gutter={[16, 16]} className="mt-8">
          <Col xs={24} sm={12} md={8}>
            <Card className="text-center border-0">
              <Statistic
                title="Xonadagi Guruhlar Soni"
                value={totalSchedules}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="text-center border-0">
              <Statistic
                title="Haftaning Darsli Kunlari"
                value={daysWithSchedules}
                suffix="kun"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="text-center border-0">
              <Statistic
                title="Xonaning Holati"
                value={daysWithSchedules > 0 ? 'Band' : "Bo'sh"}
                valueStyle={{ color: daysWithSchedules > 0 ? '#ff4d4f' : '#52c41a' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}