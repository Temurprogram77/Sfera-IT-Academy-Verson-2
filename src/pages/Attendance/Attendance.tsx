import { useState } from "react";
import {
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Popconfirm,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { SearchOutlined } from "@ant-design/icons";
import { toast, Toaster } from "sonner";
import { useTheme } from "../../context/ThemeContext";

interface AttendanceRecord {
  id: number;
  student: string;
  course: string;
  group: string;
  date: string;
  status: "Kelgan" | "Kelmagan";
}

const initialAttendance: AttendanceRecord[] = [
  { id: 1, student: "Aliyev Jamshid", course: "Frontend", group: "FE-01", date: "2025-12-27", status: "Kelgan" },
  { id: 2, student: "Qodirova Mohira", course: "Backend", group: "BE-02", date: "2025-12-27", status: "Kelmagan" },
  { id: 3, student: "Rustamov Aziz", course: "Python", group: "PY-01", date: "2025-12-27", status: "Kelgan" },
];

const Attendance = () => {
  const { theme } = useTheme(); // Hook faqat komponent ichida
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [attendance, setAttendance] = useState(initialAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [form] = Form.useForm();

  // Qidiruv
  const filteredData = attendance.filter(
    (r) =>
      r.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModal = (record: AttendanceRecord | null = null) => {
    setEditingRecord(record);
    form.setFieldsValue(record || { student: "", course: "", group: "", date: "", status: "Kelgan" });
    setIsModalVisible(true);
  };

  const handleSave = (values: any) => {
    if (editingRecord) {
      setAttendance((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? { ...r, ...values } : r))
      );
      toast.success("Davomat ma'lumotlari yangilandi!");
    } else {
      setAttendance((prev) => [...prev, { id: Date.now(), ...values }]);
      toast.success("Yangi davomat ma'lumotlari qo‘shildi!");
    }
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    setAttendance((prev) => prev.filter((r) => r.id !== id));
    toast.success("Davomat ma'lumotlari o‘chirildi!");
  };

  const columns = [
    {
      title: "Talaba",
      dataIndex: "student",
      key: "student",
      render: (text: string) => (
        <div className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{text}</div>
      ),
    },
    { title: "Kurs", dataIndex: "course", key: "course", render: (t: string) => <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{t}</span> },
    { title: "Guruh", dataIndex: "group", key: "group", render: (t: string) => <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{t}</span> },
    { title: "Sana", dataIndex: "date", key: "date", render: (d: string) => <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{d}</span> },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "Kelgan" ? "green" : "red"}
          className="font-semibold"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Amallar",
      key: "action",
      render: (_: any, record: AttendanceRecord) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PencilIcon className="w-4 h-4" />}
            size="small"
            onClick={() => showModal(record)}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Haqiqatan ham o‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button type="default" size="small" icon={<TrashBinIcon className="w-4 h-4" />}>
              O‘chirish
            </Button>
          </Popconfirm>
        </div>
      ),
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
      <div className={`p-4 sm:p-2 min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        {/* Sonner Toaster */}
        <Toaster
          position="top-right"
          richColors
          theme={theme === "dark" ? "dark" : "light"} // dark/light moslash
        />

        {/* Qidiruv + Qo‘shish */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
          <Input
            placeholder="Talaba, kurs yoki guruhni qidirish..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-80"
          />
          <Button type="primary" onClick={() => showModal()} className="sm:self-end">
            Yangi davomat
          </Button>
        </div>

        {/* Jadval */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
            className={`rounded-lg ${theme === "dark" ? "dark:bg-gray-800" : ""}`}
          />
        </div>

        {/* Modal */}
        <Modal
          title={editingRecord ? "Davomat tahrirlash" : "Yangi davomat qo‘shish"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => {
            form
              .validateFields()
              .then((values) => handleSave(values))
              .catch(() => {});
          }}
          okText="Saqlash"
          cancelText="Bekor qilish"
          width={500}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="student" label="Talaba" rules={[{ required: true }]}>
              <Input placeholder="Talaba ismi" />
            </Form.Item>
            <Form.Item name="course" label="Kurs" rules={[{ required: true }]}>
              <Input placeholder="Kurs nomi" />
            </Form.Item>
            <Form.Item name="group" label="Guruh" rules={[{ required: true }]}>
              <Input placeholder="Guruh nomi" />
            </Form.Item>
            <Form.Item name="date" label="Sana" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="status" label="Holati" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Kelgan">Kelgan</Select.Option>
                <Select.Option value="Kelmagan">Kelmagan</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Attendance;
