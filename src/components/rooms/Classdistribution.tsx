import { Card, Badge, Progress } from 'antd'
import { CLASS_DISTRIBUTION } from '../../constants/data'

export default function ClassDistribution() {
  return (
    <Card
      title={<h2 className="text-xl font-bold text-slate-900">Class Distribution</h2>}
      className="shadow-sm"
    >
      <div className="space-y-6">
        {CLASS_DISTRIBUTION.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">{item.name}</p>
              <Badge color={item.color} text={`${item.days} days`} />
            </div>
            <Progress percent={item.days * 33} strokeColor={item.color} />
          </div>
        ))}
      </div>
    </Card>
  )
}