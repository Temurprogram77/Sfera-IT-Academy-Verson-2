'use client'

import Header from '../../components/rooms/Header'
import ScheduleList from '../../components/rooms/Schedulelist'
import Overview from '../../components/rooms/Overview'
import WeeklyStatistics from '../../components/rooms/Weeklystatistics'
import ClassDistribution from '../../components/rooms/Classdistribution'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#eef2ff] dark:bg-[#101828] p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ScheduleList />
          </div>
          <div>
            <Overview />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyStatistics />
          </div>
          <div>
            <ClassDistribution />
          </div>
        </div>
      </div>
    </div>
  )
}