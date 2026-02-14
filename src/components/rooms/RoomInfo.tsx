'use client'

import { Card, Row, Col, Statistic } from 'antd'
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Room } from '../../types/room'

interface RoomInfoProps {
  room: Room
}

const WORK_START = 8
const WORK_END = 20

const parseTimeToDecimal = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h + m / 60
}

export default function RoomInfo({ room }: RoomInfoProps) {
  const [isBusy, setIsBusy] = useState(false)

  const totalSchedules = room.schedules?.length || 0
  const daysWithSchedules = new Set(
    (room.schedules || []).flatMap((s) => s.weekDays)
  ).size

  const checkCurrentStatus = () => {
    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() + now.getMinutes() / 60

    if (currentDay === 0) {
      setIsBusy(false)
      return
    }

    if (currentTime < WORK_START || currentTime >= WORK_END) {
      setIsBusy(false)
      return
    }

    const todaySchedules = (room.schedules || []).filter((s) =>
      s.weekDays.includes(currentDay)
    )

    const busyNow = todaySchedules.some((s) => {
      const start = parseTimeToDecimal(s.startTime)
      const end = parseTimeToDecimal(s.endTime)
      return currentTime >= start && currentTime < end
    })

    setIsBusy(busyNow)
  }

  useEffect(() => {
    checkCurrentStatus()
    const interval = setInterval(checkCurrentStatus, 60000)
    return () => clearInterval(interval)
  }, [room])

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
                styles={{ content: { color: '#1890ff'} }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card className="text-center border-0">
              <Statistic
                title="Haftaning Darsli Kunlari"
                value={daysWithSchedules}
                suffix="kun"
                styles={{ content: { color: '#52c41a'} }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card className="text-center border-0">
              <Statistic
                title="Xonaning Holati"
                value={isBusy ? 'Band' : "Bo'sh"}
                styles={{ content: { color: isBusy ? '#ff4d4f' : '#52c41a' } }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}