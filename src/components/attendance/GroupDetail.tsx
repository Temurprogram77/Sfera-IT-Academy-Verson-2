'use client'

import { Card, DatePicker, Breadcrumb, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { Group } from '../../lib/mockData'
import StatisticsBar from './StatisticsBar'
import AttendanceTable from './AttendanceTable'
import { useState } from 'react'
import dayjs from 'dayjs'

interface GroupDetailProps {
  group: Group
  onBack: () => void
}

export default function GroupDetail({ group, onBack }: GroupDetailProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs())

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div>
        <Breadcrumb
          items={[
            {
              onClick: onBack,
              title: (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  <ArrowLeftOutlined />
                  Guruhlar
                </button>
              ),
            },
            {
              title: <span className="font-medium text-gray-900">{group.name}</span>,
            },
          ]}
        />
      </div>

      {/* Group Information Card */}
      <Card className="shadow-sm border border-gray-200">
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Guruh nomi
              </div>
              <div className="text-lg font-bold text-gray-900">{group.name}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                O'qituvchi
              </div>
              <div className="text-lg font-bold text-gray-900">{group.teacher}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Talabalar soni
              </div>
              <div className="text-lg font-bold text-gray-900">{group.studentCount}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Date Picker Section */}
      <Card className="shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Sana tanlang
            </div>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              style={{ width: '100%', maxWidth: 300 }}
            />
          </div>
        </div>
      </Card>

      {/* Statistics Section */}
      <StatisticsBar
        presentCount={group.presentCount}
        lateCount={group.lateCount}
        absentCount={group.absentCount}
      />

      {/* Attendance Table Section */}
      <AttendanceTable students={group.students} />
    </div>
  )
}
