'use client'

import { Card, Collapse, Tag, Empty } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
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

const getDayColor = (index: number): string => {
  const colors = ['blue', 'cyan', 'green', 'orange', 'red', 'purple', 'magenta']
  return colors[index % colors.length]
}

export default function WeeklyAvailability({ weeklyStats }: WeeklyAvailabilityProps) {
  if (weeklyStats.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Empty description="Haftaviy jadval ma'lumotlari mavjud emas" />
      </Card>
    )
  }

  const items = weeklyStats.map((stat, index) => {
    const dayName = dayNameMap[stat.day] || stat.day
    const busyHours = stat.busy.reduce((acc, slot) => acc + (slot.end.hour - slot.start.hour), 0)

    return {
      key: stat.day,
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="font-semibold">{dayName}</span>
          <div className="flex gap-2">
            <Tag color={getDayColor(index)}>Band: {busyHours}h</Tag>
            <Tag color="green">Bo'sh: {24 - busyHours}h</Tag>
          </div>
        </div>
      ),
      children: (
        <div className="space-y-6">
          {/* Band vaqtlar */}
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <ClockCircleOutlined />
              Band Vaqtlar
            </h4>
            {stat.busy.length > 0 ? (
              <div className="space-y-2">
                {stat.busy.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                    <div className="w-2 h-8 bg-red-500 rounded"></div>
                    <span className="font-mono text-sm font-semibold">{formatTime(slot)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Bugun band vaqt yo'q</p>
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
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                    <div className="w-2 h-8 bg-green-500 rounded"></div>
                    <span className="font-mono text-sm font-semibold">{formatTime(slot)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Bugun bo'sh vaqt yo'q</p>
            )}
          </div>
        </div>
      ),
    }
  })

  return (
    <Card className="border-0 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Haftaviy Band va Bo'sh Vaqtlar</h2>
      </div>
      <Collapse items={items} defaultActiveKey={[weeklyStats[0]?.day]} />
    </Card>
  )
}
