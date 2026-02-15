'use client'

import { Row, Col, Card, Button } from 'antd'
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import type { Group } from '../../lib/mockData'

interface GroupsGridProps {
  groups: Group[]
  onSelectGroup: (group: Group) => void
}

export default function GroupsGrid({ groups, onSelectGroup }: GroupsGridProps) {
  return (
    <Row gutter={[24, 24]}>
      {groups.map((group) => (
        <Col key={group.id} xs={24} sm={12} lg={8}>
          <Card
            hoverable
            className="h-full shadow-sm cursor-pointer border border-gray-200"
            onClick={() => onSelectGroup(group)}
          >
            <div className="flex flex-col h-full gap-4">
              {/* Group Name */}
              <h3 className="text-lg font-bold text-gray-900">
                {group.name}
              </h3>

              {/* Teacher */}
              <div className="flex items-center text-gray-600 text-sm">
                <BookOutlined size={16} className="mr-2" />
                {group.teacher}
              </div>

              {/* Student Count */}
              <div className="flex items-center text-gray-600 text-sm">
                <UserOutlined size={16} className="mr-2" />
                {group.studentCount} talaba
              </div>

              {/* Action Button */}
              <Button
                type="primary"
                block
                onClick={() => onSelectGroup(group)}
                className="mt-auto bg-green-600 hover:bg-green-700 border-green-600"
              >
                Batafsil
              </Button>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}