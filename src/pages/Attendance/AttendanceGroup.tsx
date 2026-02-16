'use client'

import { useNavigate } from "react-router-dom";
import { Space, Typography } from "antd";
import GroupsGrid from "../../components/attendance/GroupsGrid";
import { useAllGroups } from "../../hooks/useGroups";

const { Title, Text } = Typography;

export default function AttendancePage() {
  const navigate = useNavigate();
  const { groups, loading, error } = useAllGroups();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={2} className="mb-2 text-gray-900">Guruhlar</Title>
          <Text type="secondary">
            Talabalarning davomat ma'lumotlarini ko'rish uchun guruhni tanlang
          </Text>
        </div>
        
        <GroupsGrid
          groups={groups}
          loading={loading}
          error={error}
          onSelectGroup={(group) => {
            navigate(`/attendance/${group.id}`);
          }}
        />
      </Space>
    </div>
  );
}