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
    <div className="border-l-4 border-indigo-500 dark:border-[#1d2939] bg-[#eef2ff] dark:bg-[#111827] p-4 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">{schedule.title}</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">{schedule.location}</p>
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