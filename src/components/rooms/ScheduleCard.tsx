import { Badge } from 'antd'
import { getDayColor } from '../../utils/helpers'

interface ScheduleProps {
  schedule: {
    id: number
    title: string
    location: string
    time: string
    count: number
    days: string[]
  }
}

export default function ScheduleCard({ schedule }: ScheduleProps) {
  return (
    <div className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-transparent p-4 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{schedule.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{schedule.location}</p>
          <p className="text-indigo-600 font-semibold text-sm mt-2">{schedule.time}</p>
          <div className="flex gap-2 mt-3">
            {schedule.days.map((day) => (
              <Badge key={day} color={getDayColor(day)} text={day} />
            ))}
          </div>
        </div>
        <div className="text-right">
          <Badge 
            count={schedule.count} 
            style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }} 
          />
        </div>
      </div>
    </div>
  )
}