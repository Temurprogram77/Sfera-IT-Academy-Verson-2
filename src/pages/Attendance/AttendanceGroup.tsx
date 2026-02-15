'use client'

import { useState } from 'react'
import { Layout, Space, Typography } from 'antd'
import GroupsGrid from '../../components/attendance/GroupsGrid'
import GroupDetail from '../../components/attendance/GroupDetail'
import { mockGroups } from '../../lib/mockData'
import type { Group } from '../../lib/mockData'

const { Content, Header } = Layout
const { Title, Text } = Typography

export default function AttendanceGroup() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  return (
    <Layout className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Main Content */}
      <Content style={{ padding: '32px 24px' }}>
        <div className="max-w-7xl mx-auto">
          {!selectedGroup ? (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={2} className="mb-2 text-gray-900">
                  Guruhlar
                </Title>
                <Text type="secondary">
                  Talabalarning davomat ma'lumotlarini ko'rish uchun guruhni tanlang
                </Text>
              </div>
              <GroupsGrid
                groups={mockGroups}
                onSelectGroup={setSelectedGroup}
              />
            </Space>
          ) : (
            <GroupDetail
              group={selectedGroup}
              onBack={() => setSelectedGroup(null)}
            />
          )}
        </div>
      </Content>
    </Layout>
  )
}
