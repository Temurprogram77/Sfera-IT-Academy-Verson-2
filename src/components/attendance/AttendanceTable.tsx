'use client'

import { Table, Badge, Input, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'
import { useState, useMemo } from 'react'
import type { Student, AttendanceStatus } from '../../lib/mockData'

interface AttendanceTableProps {
  students: Student[]
}

const STATUS_CONFIG = {
  present: {
    label: 'Yetib kelgan',
    color: 'green',
  },
  late: {
    label: 'Kechiktirilgan',
    color: 'default',
  },
  absent: {
    label: 'Qolgan',
    color: 'default',
  },
}

export default function AttendanceTable({ students }: AttendanceTableProps) {
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | 'all'>('all')

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [students, searchText, filterStatus])

  const columns: TableColumnsType<Student> = [
    {
      title: 'Talaba ismi',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text: string) => <span className="font-medium text-gray-900">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '30%',
      render: (status: AttendanceStatus) => {
        const config = STATUS_CONFIG[status]
        return <Badge status={config.color as any} text={config.label} />
      },
    },
    {
      title: 'Izoh',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (text: string) => <span className="text-gray-600">{text || '-'}</span>,
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Talaba ismi bo'yicha qidirish..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', maxWidth: 300 }}
          />
          <Select
            style={{ width: '100%', maxWidth: 220 }}
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: 'Barcha statislari', value: 'all' },
              { label: 'Yetib kelgan', value: 'present' },
              { label: 'Kechiktirilgan', value: 'late' },
              { label: 'Qolgan', value: 'absent' },
            ]}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
          size="middle"
          bordered
        />
      </Space>
    </div>
  )
}
