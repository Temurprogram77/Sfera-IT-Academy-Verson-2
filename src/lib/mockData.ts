export type AttendanceStatus = 'present' | 'late' | 'absent'

export interface Student {
  id: string
  name: string
  status: AttendanceStatus
  description: string
}

export interface Group {
  id: string
  name: string
  teacherName: string
  studentCount: number
  presentCount: number
  lateCount: number
  absentCount: number
  students: Student[]
}
