import { Card } from 'antd'
import StatCard from './Statcard'
import { STATS } from  '../../constants/data'

export default function Overview() {
  return (
    <Card title="Overview" className="shadow-sm mb-6">
      <div className="space-y-4">
        {STATS.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </Card>
  )
}


