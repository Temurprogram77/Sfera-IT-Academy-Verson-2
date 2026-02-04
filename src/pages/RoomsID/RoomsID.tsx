import { useState, useMemo } from "react";
import { Tag, Typography, Avatar, Space } from "antd";

import { UserOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";

import ListHeader from "../../components/ListHeader/ListHeader";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { Schedule } from "../../types/room";

const { Text } = Typography;

const roomData = {
  name: "Frontend 12-guruh",

  schedules: [
    {
      id: 1,
      subject: "React JS",
      days: ["Dushanba", "Chorshanba", "Juma"],
      startTime: "14:00",
      endTime: "16:00",
      teacher: "Akmal Ustoz",
      students: ["Ali", "Vali", "Hasan"],
      room: "12-xona",
      description: "React asoslari",
    },

    {
      id: 2,
      subject: "JavaScript",
      days: ["Seshanba", "Payshanba"],
      startTime: "10:00",
      endTime: "12:00",
      teacher: "Bekzod Ustoz",
      students: ["Aziz", "Jasur"],
      room: "12-xona",
      description: "JS asoslari",
    },
  ],
};

/* ================= COMPONENT ================= */

const RoomsID = () => {
  const [search, setSearch] = useState("");

  /* ================= FILTER ================= */
  const { t } = useTranslation();
  const filteredData = useMemo(() => {
    return roomData.schedules.filter(
      (item) =>
        item.subject.toLowerCase().includes(search.toLowerCase()) ||
        item.teacher.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  /* ================= COLUMNS ================= */

  const columnsConfig = [
    {
      key: "subject",
      title: t("subject"),

      render: (record: Schedule) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<BookOutlined />} className="bg-blue-500" />

          <Text strong>{record.subject}</Text>
        </div>
      ),
    },

    {
      key: "days",
      title: t("days"),

      render: (record: Schedule) => (
        <Space wrap>
          {record.days.map((day, i) => (
            <Tag key={i} color="blue">
              {day}
            </Tag>
          ))}
        </Space>
      ),
    },

    {
      key: "startTime",
      title: t("time"),

      render: (record: Schedule) => (
        <Tag color="green">
          {record.startTime} - {record.endTime}
        </Tag>
      ),
    },

    {
      key: "teacher",
      title: t("teacher"),

      render: (record: Schedule) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.teacher}</Text>
        </Space>
      ),
    },

    {
      key: "students",
      title: t("students"),

      render: (record: Schedule) => (
        <Space>
          <Avatar size="small" icon={<TeamOutlined />} />
          <Text>{record.students.length} ta</Text>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}

      <ListHeader
        title={roomData.name}
        count={filteredData.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("subjectOrTeacher")}
        buttonText={t("addLesson")}
        onButtonClick={() => {}}
      />

      {/* TABLE */}

      <TableComponent<Schedule>
        data={filteredData}
        columnsConfig={columnsConfig}
        itemName="Dars"
      />
    </div>
  );
};

export default RoomsID;
