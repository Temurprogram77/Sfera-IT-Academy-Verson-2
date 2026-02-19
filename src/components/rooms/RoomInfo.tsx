'use client'

import { Card, Row, Col, Statistic } from 'antd'
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useEffect, useState, useCallback } from 'react'
import { Room } from '../../types/room'

interface RoomInfoProps {
  room: Room
}

const WORK_START = 8
const WORK_END = 20

const parseTimeToDecimal = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h + (m || 0) / 60
}

export default function RoomInfo({ room }: RoomInfoProps) {
  const [isBusy, setIsBusy] = useState(false)

  const totalSchedules = room.schedules?.length || 0
  const daysWithSchedules = new Set(
    (room.schedules || []).flatMap((s) => s.weekDays)
  ).size

  const checkCurrentStatus = useCallback(() => {
    const now = new Date()
    const currentDay = now.getDay();
    // FIX: Convert currentDay (number) to string to match weekDays array type
    const currentDayStr = String(currentDay);

    const currentTime = now.getHours() + now.getMinutes() / 60

    if (currentDay === 0) { // Sunday
      setIsBusy(false)
      return
    }

    if (currentTime < WORK_START || currentTime >= WORK_END) {
      setIsBusy(false)
      return
    }

    const todaySchedules = (room.schedules || []).filter((s) =>
      // FIX: Ensure types match for the .includes check
      s.weekDays.map(String).includes(currentDayStr)
    )

    const busyNow = todaySchedules.some((s) => {
      const start = parseTimeToDecimal(s.startTime)
      const end = parseTimeToDecimal(s.endTime)
      return currentTime >= start && currentTime < end
    })

    setIsBusy(busyNow)
  }, [room.schedules])

  useEffect(() => {
    checkCurrentStatus()
    const interval = setInterval(checkCurrentStatus, 60000)
    return () => clearInterval(interval)
  }, [checkCurrentStatus])

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
                value={isBusy ? 'Band' : "Bo'sh"}
                valueStyle={{ color: isBusy ? '#ff4d4f' : '#52c41a' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
