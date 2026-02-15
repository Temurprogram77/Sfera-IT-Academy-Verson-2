'use client';

import { useState, useMemo } from 'react';
import {
  Collapse,
  Space,
  Input,
  Select,
  Button,
  Row,
  Col,
  Statistic,
  Card,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import StudentList from './StudentList';
import type { AttendanceGroup, AttendanceStatus } from '../../types/attendance';

interface AttendanceListProps {
  groups: AttendanceGroup[];
  onDataUpdate?: (groups: AttendanceGroup[]) => void;
}

export default function AttendanceList({
  groups,
  onDataUpdate,
}: AttendanceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'ALL'>('ALL');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // Calculate statistics for each group
  const groupsWithStats = useMemo(
    () =>
      groups.map((group) => {
        const presentCount = group.students.filter((s) => s.status === 'KELDI').length;
        const absentCount = group.students.filter((s) => s.status === 'KELMADI').length;
        const lateCount = group.students.filter((s) => s.status === 'KECHIKTI').length;
        const notTodayCount = group.students.filter((s) => s.status === 'BUGUN_YOQ').length;

        return {
          ...group,
          stats: {
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            notToday: notTodayCount,
            total: group.students.length,
          },
        };
      }),
    [groups]
  );

  // Filter groups based on search term
  const filteredGroups = useMemo(
    () =>
      groupsWithStats.filter(
        (group) =>
          group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.students.some(
            (s) =>
              s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.studentId.includes(searchTerm)
          )
      ),
    [groupsWithStats, searchTerm]
  );

  // Handle expand/collapse all
  const handleExpandAll = () => {
    setExpandedKeys(filteredGroups.map((g) => g.id));
  };

  const handleCollapseAll = () => {
    setExpandedKeys([]);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Controls Section */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Search and Filter Row */}
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Guruh yoki talaba nomi bo'yicha izlash..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12}>
              <Select
                style={{ width: '100%' }}
                placeholder="Status bo'yicha filtrlash"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'Barcha statuslar', value: 'ALL' },
                  { label: 'Keldi', value: 'KELDI' },
                  { label: 'Kelmadi', value: 'KELMADI' },
                  { label: 'Kechikti', value: 'KECHIKTI' },
                  { label: 'Bugun yo\'q', value: 'BUGUN_YOQ' },
                ]}
              />
            </Col>
          </Row>

          {/* Expand/Collapse All Buttons */}
          <Space>
            <Button onClick={handleExpandAll}>
              Hammasini ochish
            </Button>
            <Button onClick={handleCollapseAll}>
              Hammasini yopish
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Groups Accordion */}
      <Collapse
        items={filteredGroups.map((group) => ({
          key: group.id,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingRight: 16 }}>
              <span>{group.groupName}</span>
              <Space size="small">
                <span style={{ fontSize: 12, color: '#999' }}>
                  Jami: {group.stats.total}
                </span>
                <span style={{ fontSize: 12, color: '#52c41a' }}>
                  Keldi: {group.stats.present}
                </span>
                <span style={{ fontSize: 12, color: '#f5222d' }}>
                  Kelmadi: {group.stats.absent}
                </span>
              </Space>
            </div>
          ),
          children: (
            <StudentList
              students={group.students}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ),
        }))}
        expandIconPosition="start"
        activeKey={expandedKeys}
        onChange={(keys) => setExpandedKeys(keys as string[])}
      />

      {/* Summary Statistics */}
      {filteredGroups.length > 0 && (
        <Card title="Umumiy statistika" size="small">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Jami guruhlar"
                value={filteredGroups.length}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Jami talabalar"
                value={filteredGroups.reduce((sum, g) => sum + g.stats.total, 0)}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Keldi"
                value={filteredGroups.reduce((sum, g) => sum + g.stats.present, 0)}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Kelmadi"
                value={filteredGroups.reduce((sum, g) => sum + g.stats.absent, 0)}
                valueStyle={{ color: '#f5222d' }}
              />
            </Col>
          </Row>
        </Card>
      )}
    </Space>
  );
}
