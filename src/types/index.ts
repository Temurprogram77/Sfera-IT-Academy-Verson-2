export interface Schedule {
  id: number
  title: string
  location: string
  time: string
  count: number
  days: string[]
}

export interface Stat {
  label: string
  value: string
  subtitle: string
  bgColor: string
  textColor: string
}

export interface ClassItem {
  name: string
  days: number
  color: string
}

export interface ChartData {
  day: string
  busy: number
  free: number
}