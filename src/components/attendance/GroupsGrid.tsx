'use client'

import { Row, Col, Card, Button } from 'antd'
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; 

interface GroupsGridProps {
  groups: any[]; // yoki API dan kelgan guruh type
  loading?: boolean;
  error?: any;
  onSelectGroup?: (group: any) => void; // optional qildim
}

export default function GroupsGrid({ groups, loading, error }: GroupsGridProps) {
  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div>Xatolik yuz berdi</div>;
  }

  return (
    <Row gutter={[24, 24]}> 
      {groups.map((group) => (
        <Col key={group.id} xs={24} sm={12} lg={8}>
          <Card
            hoverable
            className="h-full cursor-pointer border border-gray-200"
          >
            <div className="flex flex-col h-full gap-4">
              <h3 className="text-lg font-bold text-gray-900">
                {group.name}
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <BookOutlined style={{ fontSize: 16, marginRight: 8 }} />
                {group.teacherName}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <UserOutlined style={{ fontSize: 16, marginRight: 8 }} />
                {group.studentCount} talaba
              </div>
              <Link to={`/attendance/group/${group.id}`}>
                <Button
                  type="primary"
                  block
                  className="mt-auto bg-green-600 hover:bg-green-700 border-green-600"
                >
                  Batafsil
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}