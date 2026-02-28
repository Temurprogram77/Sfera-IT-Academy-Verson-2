// components/AssessmentDetail.tsx
import React, { useState } from "react";
import { Tabs, TabsProps } from "antd";
import { BookOutlined, HistoryOutlined } from "@ant-design/icons";
import AssessmentStudentList from "./AssessmentStudentList";
import AssessmentHistoryTable from "./AssessmentHistoryTable";

interface AssessmentDetailProps {
  groupId: number | string;
  groupName?: string;
}

const AssessmentDetail: React.FC<AssessmentDetailProps> = ({
  groupId,
  groupName,
}) => {
  const [activeTab, setActiveTab] = useState("students");

  const items: TabsProps["items"] = [
    {
      key: "students",
      label: (
        <span className="flex items-center gap-2">
          <BookOutlined />
          O'quvchilarni baholash
        </span>
      ),
      children: (
        <AssessmentStudentList groupId={groupId} groupName={groupName} />
      ),
    },
    {
      key: "history",
      label: (
        <span className="flex items-center gap-2">
          <HistoryOutlined />
          Baholash tarixi
        </span>
      ),
      children: <AssessmentHistoryTable groupId={groupId} />,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {groupName && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{groupName}</h1>
          <p className="text-gray-500 mt-1">Guruh baholash paneli</p>
        </div>
      )}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        />
      </div>
    </div>
  );
};

export default AssessmentDetail;