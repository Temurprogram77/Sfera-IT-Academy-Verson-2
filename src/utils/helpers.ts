import { DAY_COLORS } from '../constants/data'

export const getDayColor = (day: string): string => {
  return DAY_COLORS[day] || '#6b7280'
}

export const calculateTotalHours = (data: Array<{ busy: number; free: number }>) => {
  const totalBusy = data.reduce((sum, item) => sum + item.busy, 0)
  const totalFree = data.reduce((sum, item) => sum + item.free, 0)
  return { totalBusy, totalFree }
}