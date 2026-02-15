'use client'

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Space, Typography } from "antd";
import GroupsGrid from "../../components/attendance/GroupsGrid";
import Attendance from "./Attendance";
import { mockGroups, Group } from "../../lib/mockData";

const { Title, Text } = Typography;

export default function AttendancePage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
    console.log(groupId);
    
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    () => mockGroups.find(g => g.id.toString() === groupId) || null
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={2} className="mb-2 text-gray-900">Guruhlar</Title>
          <Text type="secondary">
            Talabalarning davomat ma'lumotlarini ko'rish uchun guruhni tanlang
          </Text>
        </div>

        {!selectedGroup ? (
          <GroupsGrid
            groups={mockGroups}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              navigate(`/attendance/group/${group.id}`);
            }}
          />
        ) : (
          <Attendance
            group={selectedGroup}
            onBack={() => {
              setSelectedGroup(null);
              navigate("/attendance");
            }}
          />
        )}
      </Space>
    </div>
  );
}