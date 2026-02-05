import { Card } from 'antd'
import ScheduleCard from './ScheduleCard'
import { SCHEDULES } from  '../../constants/data'


export default function ScheduleList() {
  return (
    <Card
      title={
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Schedules</h2>
          <p className="text-sm text-slate-500 mt-1">All room schedules and classes</p>
        </div>
      }
      className="shadow-sm"
    >
      <div className="space-y-4">
        {SCHEDULES.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </Card>
  )
}