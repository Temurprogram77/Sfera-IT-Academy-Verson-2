'use client'

import { Row, Col, Statistic } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

interface StatisticsBarProps {
  presentCount: number
  lateCount: number
  absentCount: number
}

const StatCard = ({ icon, title, value, color }: any) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
    <Statistic
      title={title}
      value={value}
      prefix={icon}
      valueStyle={{ color, fontSize: '28px', fontWeight: '700' }}
    />
  </div>
)

export default function StatisticsBar({
  presentCount,
  lateCount,
  absentCount,
}: StatisticsBarProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <StatCard
          icon={<CheckCircleOutlined className="text-green-600" />}
          title="Yetib kelgan"
          value={presentCount}
          color="#16a34a"
        />
      </Col>
      <Col xs={24} sm={8}>
        <StatCard
          icon={<ClockCircleOutlined className="text-gray-500" />}
          title="Kechiktirilgan"
          value={lateCount}
          color="#6b7280"
        />
      </Col>
      <Col xs={24} sm={8}>
        <StatCard
          icon={<CloseCircleOutlined className="text-gray-500" />}
          title="Qolgan"
          value={absentCount}
          color="#6b7280"
        />
      </Col>
    </Row>
  )
}