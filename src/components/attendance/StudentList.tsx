'use client';

import { List, Badge, Tag, Empty, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Attendance, AttendanceStatus } from '../../types/attendance';
import { STATUS_CONFIG } from '../../types/attendance';

interface StudentListProps {
  students: Attendance[];
  searchTerm?: string;
  statusFilter?: AttendanceStatus | 'ALL';
}

export default function StudentList({
  students,
  searchTerm = '',
  statusFilter = 'ALL',
}: StudentListProps) {
  // Filter students based on search term and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === '' ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filteredStudents.length === 0) {
    return (
      <Empty
        description={searchTerm || statusFilter !== 'ALL' ? 'Hech qanday talaba topilmadi' : 'Talabalar mavjud emas'}
        style={{ marginTop: 16 }}
      />
    );
  }

  return (
    <List
      dataSource={filteredStudents}
      renderItem={(student) => {
        const statusConfig = STATUS_CONFIG[student.status];

        return (
          <List.Item key={student.id}>
            <List.Item.Meta
              avatar={<UserOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
              title={
                <Space>
                  <span>{student.fullName}</span>
                  <Tag>{student.studentId}</Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Badge
                    color={statusConfig.color}
                    text={statusConfig.label}
                  />
                  <span style={{ fontSize: 12, color: '#999' }}>
                    Sana: {student.date}
                    {student.notes && ` • Izoh: ${student.notes}`}
                  </span>
                </Space>
              }
            />
          </List.Item>
        );
      }}
      style={{ marginTop: 12 }}
    />
  );
}