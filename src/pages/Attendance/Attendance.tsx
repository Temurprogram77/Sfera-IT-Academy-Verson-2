'use client'

import { useEffect, useState } from "react";
import { Card, DatePicker, Breadcrumb, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { createSSE } from '../../services/sseService';
import StatisticsBar from '../../components/attendance/StatisticsBar';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import { mockGroups, type Group } from '../../lib/mockData';
import { useParams } from "react-router";

interface AttendanceRecord {
  id: number;
  fullName: string;
  studentId: number;
  status: string;
  description: string | null;
  date: string;
}

interface AttendanceProps {
  group: Group;
  onBack: () => void;
}

export default function Attendance({ group, onBack }: AttendanceProps) {
   const { groupId } = useParams<{ groupId: string }>();
    console.log(groupId);
    
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    () => mockGroups.find(g => g.id.toString() === groupId) || null
  );

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  console.log(group);
  
  useEffect(() => {
    if (!group?.id) return; // xavfsizlik uchun tekshiruv

    const sse = createSSE({
      url: `http://5.189.158.5:8082/attendance/stream/${group.id}`,
      eventName: "attendance",
      onMessage: (data: AttendanceRecord[]) => setAttendance(data),
    });

    return () => sse.close();
  }, [group.id]);
  if (!group) return <div>Guruh topilmadi</div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            onClick: onBack,
            title: (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <ArrowLeftOutlined />
                Guruhlar
              </button>
            ),
          },
          { title: <span className="font-medium text-gray-900">{group.name}</span> },
        ]}
      />

      {/* Group Info */}
      <Card className="shadow-sm border border-gray-200">
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Guruh nomi</div>
              <div className="text-lg font-bold text-gray-900">{group.name}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">O'qituvchi</div>
              <div className="text-lg font-bold text-gray-900">{group.teacherName}</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Talabalar soni</div>
              <div className="text-lg font-bold text-gray-900">{group.studentCount}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Date Picker */}
      <Card className="shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Sana tanlang</div>
            <DatePicker
              value={selectedDate}
              onChange={date => date && setSelectedDate(date)}
              style={{ width: '100%', maxWidth: 300 }}
            />
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <StatisticsBar
        presentCount={attendance.filter(a => a.status === 'KELDI').length}
        lateCount={attendance.filter(a => a.status === 'KECHIKTI').length}
        absentCount={attendance.filter(a => a.status === 'KELMADI').length}
      />

      {/* Attendance Table */}
      {/* <AttendanceTable students={attendance} /> */}
    </div>
  );
}