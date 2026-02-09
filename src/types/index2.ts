export interface TimeSlot {
  start: {
    hour: number
    minute: number
    second: number
    nano: number
  }
  end: {
    hour: number
    minute: number
    second: number
    nano: number
  }
}

export interface WeeklyStat {
  day: string
  busy: TimeSlot[]
  free: TimeSlot[]
}

export interface Schedule {
  id: number
  name: string
  startTime: string
  endTime: string
  weekDays: string[]
  teacherId: number
  categoryId: number
  roomId: number
}

export interface RoomData {
  id: number
  name: string
  schedules: Schedule[]
  weeklyStats: WeeklyStat[]
}
