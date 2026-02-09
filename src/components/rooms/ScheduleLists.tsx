'use client'

import { Table, Tag, Card, Empty } from 'antd'
import { Schedule } from '../../types/index2'

interface ScheduleListProps {
  schedules: Schedule[]
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

const getDayColor = (day: string): string => {
  const colors = {
    MONDAY: 'blue',
    TUESDAY: 'cyan',
    WEDNESDAY: 'green',
    THURSDAY: 'orange',
    FRIDAY: 'red',
    SATURDAY: 'purple',
    SUNDAY: 'magenta',
  }
  return colors[day as keyof typeof colors] || 'default'
}

export default function ScheduleList({ schedules }: ScheduleListProps) {
  const columns = [
    {
      title: 'Guruh Nomi',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Bosh Vaqti',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => <span className="font-mono text-blue-600">{text}</span>,
    },
    {
      title: 'Tugatish Vaqti',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => <span className="font-mono text-red-600">{text}</span>,
    },
    {
      title: 'Dars Kunlari',
      dataIndex: 'weekDays',
      key: 'weekDays',
      render: (days: string[]) => (
        <div className="flex flex-wrap gap-1">
          {days.map((day) => (
            <Tag key={day} color={getDayColor(day)}>
              {dayNameMap[day] || day}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Instructor ID',
      dataIndex: 'teacherId',
      key: 'teacherId',
      align: 'center' as const,
    },
    {
      title: 'Kategoriya ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      align: 'center' as const,
    },
  ]

  if (schedules.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Empty description="Jadvallashtirilgan guruhlar mavjud emas" />
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Barcha Jadvallashtirilgan Guruhlar</h2>
      </div>
      <Table
        dataSource={schedules}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        bordered
      />
    </Card>
  )
}
