export interface TimeSlot {
  start: {
    hour: number
    minute: number
  }
  end: {
    hour: number
    minute: number
  }
}

export interface WeeklyStat {
  day: string
  busy: TimeSlot[]
  free: TimeSlot[]
}