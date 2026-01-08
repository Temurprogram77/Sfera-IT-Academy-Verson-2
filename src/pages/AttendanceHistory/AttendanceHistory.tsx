import { useMemo, useState } from "react";
import { Table, Select, Input, ConfigProvider, Tag, theme as antdTheme } from "antd";
import { useTheme } from "../../context/ThemeContext";

interface AttendanceHistoryRecord {
  id: number;
  student: string;
  group: string;
  date: string;
  status: "Kelgan" | "Kelmagan" | "Kechikkan";
  note?: string;
}

const historyData: AttendanceHistoryRecord[] = [
  { id: 1, student: "Aliyev Jamshid", group: "FE-01", date: "2025-12-20", status: "Kelgan" },
  { id: 2, student: "Aliyev Jamshid", group: "FE-01", date: "2025-12-21", status: "Kechikkan", note: "10 daqiqa" },
  { id: 3, student: "Qodirova Mohira", group: "BE-02", date: "2025-12-21", status: "Kelmagan" },
  { id: 4, student: "Rustamov Aziz", group: "PY-01", date: "2025-12-22", status: "Kelgan" },
];

const AttendanceHistory = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [filterGroup, setFilterGroup] = useState<string>();
  const [filterDate, setFilterDate] = useState<string>();
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return historyData.filter((r) => {
      const matchGroup = filterGroup ? r.group === filterGroup : true;
      const matchDate = filterDate ? r.date === filterDate : true;
      const matchSearch = search
        ? r.student.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchGroup && matchDate && matchSearch;
    });
  }, [filterGroup, filterDate, search]);

  const groups = Array.from(new Set(historyData.map((r) => r.group)));

  const statusColor = (status: string) => {
    if (status === "Kelgan") return "green";
    if (status === "Kelmagan") return "red";
    return "orange";
  };

  const columns = [
    { title: "Talaba", dataIndex: "student", key: "student" },
    { title: "Guruh", dataIndex: "group", key: "group" },
    { title: "Sana", dataIndex: "date", key: "date" },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (s: string) => <Tag color={statusColor(s)}>{s}</Tag>,
    },
    {
      title: "Izoh",
      dataIndex: "note",
      key: "note",
      render: (n: string) => n || "-",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: theme === "dark" ? "#111827" : "#ffffff",
          colorText: theme === "dark" ? "#e5e7eb" : "#111827",
          colorBorder: theme === "dark" ? "#374151" : "#e5e7eb",
        },
      }}
    >
      <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <h1 className="text-xl font-semibold mb-4">Davomat tarixi</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select
            placeholder="Guruh"
            allowClear
            className="w-40"
            value={filterGroup}
            onChange={setFilterGroup}
          >
            {groups.map((g) => (
              <Select.Option key={g} value={g}>{g}</Select.Option>
            ))}
          </Select>

          <Input
            type="date"
            className="w-40"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <Input
            placeholder="Talaba ismi"
            className="w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 700 }}
        />
      </div>
    </ConfigProvider>
  );
};

export default AttendanceHistory;
