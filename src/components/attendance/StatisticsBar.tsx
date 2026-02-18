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

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: number
  color: string
  darkColor: string
  bgClass: string
  borderClass: string
}

const StatCard = ({ icon, title, value, color, darkColor, bgClass, borderClass }: StatCardProps) => (
  <div className={`rounded-lg p-6 border shadow-sm bg-white dark:bg-gray-800 ${borderClass}`}>
    <Statistic
      title={
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </span>
      }
      value={value}
      prefix={icon}
      valueStyle={{
        color,
        fontSize: '28px',
        fontWeight: '700',
      }}
      className={`[&_.ant-statistic-content-value]:dark:text-[${darkColor}]`}
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
          icon={<CheckCircleOutlined className="text-green-600 dark:text-green-400" />}
          title="Yetib kelgan"
          value={presentCount}
          color="#16a34a"
          darkColor="#4ade80"
          bgClass="dark:bg-gray-800"
          borderClass="border-gray-200 dark:border-gray-700"
        />
      </Col>
      <Col xs={24} sm={8}>
        <StatCard
          icon={<ClockCircleOutlined className="text-yellow-500 dark:text-yellow-400" />}
          title="Kechiktirilgan"
          value={lateCount}
          color="#ca8a04"
          darkColor="#facc15"
          bgClass="dark:bg-gray-800"
          borderClass="border-gray-200 dark:border-gray-700"
        />
      </Col>
      <Col xs={24} sm={8}>
        <StatCard
          icon={<CloseCircleOutlined className="text-red-500 dark:text-red-400" />}
          title="Kelmagan"
          value={absentCount}
          color="#dc2626"
          darkColor="#f87171"
          bgClass="dark:bg-gray-800"
          borderClass="border-gray-200 dark:border-gray-700"
        />
      </Col>
    </Row>
  )
} 