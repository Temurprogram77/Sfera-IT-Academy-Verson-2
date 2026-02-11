'use client'

import { Card, Collapse, Tag, Empty, Row, Col } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Column, Line, Pie } from '@ant-design/plots'
import { WeeklyStat, TimeSlot } from '../../types/index2'

interface WeeklyAvailabilityProps {
  weeklyStats: WeeklyStat[]
}

const dayNameMap: Record<string, string> = {
  MONDAY: 'Dushanba',
  TUESDAY: 'Seshanba',
  WEDNESDAY: 'Chorshanba',
  THURSDAY: 'Payshanba',
  FRIDAY: 'Juma',
  SATURDAY: 'Shanba',
  SUNDAY: 'Yakshanba',
}

const formatTime = (slot: TimeSlot): string => {
  const hours = String(slot.start.hour).padStart(2, '0')
  const minutes = String(slot.start.minute).padStart(2, '0')
  const endHours = String(slot.end.hour).padStart(2, '0')
  const endMinutes = String(slot.end.minute).padStart(2, '0')
  return `${hours}:${minutes} - ${endHours}:${endMinutes}`
}

export default function WeeklyAvailability({ weeklyStats }: WeeklyAvailabilityProps) {
  if (weeklyStats.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Empty description="Haftaviy jadval ma'lumotlari mavjud emas" />
      </Card>
    )
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
    const busyHours = stat.busy.reduce(
      (acc, slot) => acc + (slot.end.hour - slot.start.hour),
      0
    )

    const pieData = [
      { type: 'Band', value: busyHours },
      { type: 'Bo‘sh', value: 24 - busyHours },
    ]

    return {
      key: stat.day,
      label: (
        <div className="flex justify-between w-full pr-4">
          <span className="font-semibold">
            {dayNameMap[stat.day] || stat.day}
          </span>
          <Tag color="blue">Band: {busyHours} soat</Tag>
        </div>
      ),
      children: (
        <div className="space-y-6">
          <Pie
            data={pieData}
            angleField="value"
            colorField="type"
            innerRadius={0.6}
            height={250}
          />
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <ClockCircleOutlined />
              Band Vaqtlar
            </h4>
            {stat.busy.map((slot, idx) => (
              <div key={idx} className="p-2 bg-red-50 rounded mb-2">
                {formatTime(slot)}
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <CheckCircleOutlined />
              Bo'sh Vaqtlar
            </h4>
            {stat.free.map((slot, idx) => (
              <div key={idx} className="p-2 bg-green-50 rounded mb-2">
                {formatTime(slot)}
              </div>
            ))}
          </div>
        </div>
      ),
    }
  })

  return (
    <Card className="border-0 shadow-sm">
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
    </Card>
  )
}
