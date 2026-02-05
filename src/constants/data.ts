import { Schedule, Stat, ClassItem, ChartData } from '../types/index'

export const SCHEDULES: Schedule[] = [
  {
    id: 1,
    title: 'Frontend 16',
    location: 'Sadberbek Sayfullaev • Frontend',
    time: '18:00 - 20:00',
    count: 3,
    days: ['MON', 'WED', 'FRI'],
  },
  {
    id: 2,
    title: 'Bootcamp 1',
    location: 'Sadberbek Sayfullaev • Frontend',
    time: '10:00 - 19:00',
    count: 3,
    days: ['TUE', 'THU', 'SAT'],
  },
  {
    id: 3,
    title: 'Bootcamp 1',
    location: 'Sadberbek Sayfullaev • Frontend',
    time: '12:00 - 14:00',
    count: 1,
    days: ['THU'],
  },
]

export const STATS: Stat[] = [
  {
    label: 'Total Schedules',
    value: '3',
    subtitle: 'Active courses',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
  },
  {
    label: 'Class Sessions/Week',
    value: '7',
    subtitle: 'Across all days',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    label: 'Busiest Day',
    value: 'THU',
    subtitle: '5.0 hours',
    bgColor: 'bg-red-50',
    textColor: 'text-red-500',
  },
  {
    label: 'Total Weekly Hours',
    value: '17.0',
    subtitle: 'Scheduled teaching',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
]

export const CLASS_DISTRIBUTION: ClassItem[] = [
  { name: 'Frontend 16', days: 3, color: '#10b981' },
  { name: 'Bootcamp 1', days: 3, color: '#6366f1' },
  { name: 'Bootcamp 1', days: 1, color: '#a78bfa' },
]

export const CHART_DATA: ChartData[] = [
  { day: 'MON', busy: 2, free: 10 },
  { day: 'TUE', busy: 3, free: 9 },
  { day: 'WED', busy: 2, free: 10 },
  { day: 'THU', busy: 5, free: 7 },
  { day: 'FRI', busy: 3, free: 9 },
  { day: 'SAT', busy: 3, free: 9 },
  { day: 'SUN', busy: 10, free: 2 },
]

export const DAY_COLORS: Record<string, string> = {
  MON: '#10b981',
  WED: '#ef4444',
  FRI: '#f59e0b',
  TUE: '#3b82f6',
  THU: '#8b5cf6',
  SAT: '#ec4899',
}