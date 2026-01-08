import { useState, useMemo } from "react";
import { Table, Input, Select, Button, ConfigProvider, theme as antdTheme } from "antd";
import { toast, Toaster } from "sonner";
import { useTheme } from "../../context/ThemeContext";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AttendanceRecord {
  id: number;
  student: string;
  group: string;
  date: string;
  phone?: string;
  status: "Kelgan" | "Kelmagan" | "Kechikkan";
  note?: string;
}

const initialAttendance: AttendanceRecord[] = [
  { id: 1, student: "Aliyev Jamshid", group: "FE-01", date: "2025-12-27", phone: "+998901111111", status: "Kelgan" },
  { id: 2, student: "Qodirova Mohira", group: "BE-02", date: "2025-12-27", phone: "+998902222222", status: "Kelmagan" },
  { id: 3, student: "Rustamov Aziz", group: "PY-01", date: "2025-12-27", phone: "+998903333333", status: "Kelgan" },
];

const Attendance = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [attendance, setAttendance] = useState(initialAttendance);
  const [filterGroup, setFilterGroup] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [editingStatuses, setEditingStatuses] = useState<Record<number, AttendanceRecord["status"]>>({});
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});

  const filteredData = useMemo(() => {
    if (!filterGroup && !filterDate && !filterSearch) return [];
    return attendance.filter((r) => {
      const matchGroup = filterGroup ? r.group === filterGroup : true;
      const matchDate = filterDate ? r.date === filterDate : true;
      const matchSearch = filterSearch
        ? r.student.toLowerCase().includes(filterSearch.toLowerCase()) ||
          (r.phone || "").includes(filterSearch)
        : true;
      return matchGroup && matchDate && matchSearch;
    });
  }, [attendance, filterGroup, filterDate, filterSearch]);

  const summary = useMemo(() => {
    const all = filteredData.length;
    const kelgan = filteredData.filter((r) => editingStatuses[r.id] === "Kelgan" || r.status === "Kelgan").length;
    const kelmagan = filteredData.filter((r) => editingStatuses[r.id] === "Kelmagan" || r.status === "Kelmagan").length;
    const kechikkan = filteredData.filter((r) => editingStatuses[r.id] === "Kechikkan" || r.status === "Kechikkan").length;
    return { all, kelgan, kelmagan, kechikkan };
  }, [filteredData, editingStatuses]);

  const handleStatusChange = (id: number, status: AttendanceRecord["status"]) => {
    setEditingStatuses((prev) => ({ ...prev, [id]: status }));
    if (status !== "Kechikkan") setEditingNotes((prev) => ({ ...prev, [id]: "" }));
  };

  const handleNoteChange = (id: number, note: string) => setEditingNotes((prev) => ({ ...prev, [id]: note }));

  const handleSave = () => {
    setAttendance((prev) =>
      prev.map((r) => ({
        ...r,
        status: editingStatuses[r.id] || r.status,
        note: editingNotes[r.id] || r.note,
      }))
    );
    setEditingStatuses({});
    setEditingNotes({});
    toast.success("Davomat yangilandi!");
  };

  const groups = Array.from(new Set(attendance.map((r) => r.group)));

  const columns = [
    { title: "Talaba", dataIndex: "student", key: "student", render: (t: string) => <span className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>{t}</span> },
    { title: "Guruh", dataIndex: "group", key: "group" },
    { title: "Telefon", dataIndex: "phone", key: "phone" },
    { title: "Sana", dataIndex: "date", key: "date" },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: AttendanceRecord) => (
        <div className="flex items-center gap-2">
          <Select
            value={editingStatuses[record.id] || record.status}
            onChange={(val) => handleStatusChange(record.id, val)}
            style={{ width: 120 }}
          >
            <Select.Option value="Kelgan">Kelgan</Select.Option>
            <Select.Option value="Kelmagan">Kelmagan</Select.Option>
            <Select.Option value="Kechikkan">Kechikkan</Select.Option>
          </Select>
          {editingStatuses[record.id] === "Kechikkan" && (
            <Input
              placeholder="Izoh"
              value={editingNotes[record.id] || ""}
              onChange={(e) => handleNoteChange(record.id, e.target.value)}
            />
          )}
        </div>
      ),
    },
  ];

  const chartData = {
    labels: filteredData.map((r) => r.student),
    datasets: [
      { label: "Kelgan", data: filteredData.map((r) => (editingStatuses[r.id] || r.status) === "Kelgan" ? 1 : 0), backgroundColor: "green" },
      { label: "Kelmagan", data: filteredData.map((r) => (editingStatuses[r.id] || r.status) === "Kelmagan" ? 1 : 0), backgroundColor: "red" },
      { label: "Kechikkan", data: filteredData.map((r) => (editingStatuses[r.id] || r.status) === "Kechikkan" ? 1 : 0), backgroundColor: "orange" },
    ],
  };

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
      <div className={`p-4 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <Toaster position="top-right" richColors theme={theme === "dark" ? "dark" : "light"} />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Select placeholder="Guruhni tanlang" value={filterGroup} onChange={setFilterGroup} allowClear className="w-40">
            {groups.map((g) => <Select.Option key={g} value={g}>{g}</Select.Option>)}
          </Select>
          <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-40" />
          <Input placeholder="Ism yoki telefon" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} className="w-60" />
          <Button type="primary" onClick={handleSave} disabled={Object.keys(editingStatuses).length === 0}>Saqlash</Button>
        </div>

        <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }} className={`rounded-lg ${theme === "dark" ? "dark:bg-gray-800" : ""}`} />

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-lg shadow bg-gray-100 dark:bg-gray-800"><p>Jami o‘quvchilar</p><h2 className="text-xl font-bold">{summary.all}</h2></div>
          <div className="p-4 rounded-lg shadow bg-green-100 dark:bg-green-800"><p>Kelganlar</p><h2 className="text-xl font-bold">{summary.kelgan}</h2></div>
          <div className="p-4 rounded-lg shadow bg-red-100 dark:bg-red-800"><p>Kelmaganlar</p><h2 className="text-xl font-bold">{summary.kelmagan}</h2></div>
          <div className="p-4 rounded-lg shadow bg-orange-100 dark:bg-orange-800"><p>Kechikkanlar</p><h2 className="text-xl font-bold">{summary.kechikkan}</h2></div>
        </div>

        <div className="mt-6"><Bar data={chartData} /></div>
      </div>
    </ConfigProvider>
  );
};

export default Attendance;
