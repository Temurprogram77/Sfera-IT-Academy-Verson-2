import { useState } from "react";
import { Table, Tag, Input, Button, Modal, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Attendance data tipi
interface AttendanceRecord {
  id: number;
  student: string;
  course: string;
  group: string;
  date: string;
  status: "Present" | "Absent";
}

// Static sample data
const initialAttendance: AttendanceRecord[] = [
  {
    id: 1,
    student: "Aliyev Jamshid",
    course: "Frontend",
    group: "FE-01",
    date: "2025-12-27",
    status: "Present",
  },
  {
    id: 2,
    student: "Qodirova Mohira",
    course: "Backend",
    group: "BE-02",
    date: "2025-12-27",
    status: "Absent",
  },
  {
    id: 3,
    student: "Rustamov Aziz",
    course: "Python",
    group: "PY-01",
    date: "2025-12-27",
    status: "Present",
  },
];

const Attendance = () => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null
  );

  // Qidiruv
  const filteredData = attendance.filter(
    (record) =>
      record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModal = (record: AttendanceRecord | null = null) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleSave = (values: any) => {
    if (editingRecord) {
      setAttendance((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? { ...r, ...values } : r))
      );
      message.success("Attendance record updated!");
    } else {
      setAttendance((prev) => [...prev, { id: Date.now(), ...values }]);
      message.success("New attendance record added!");
    }
    handleCancel();
  };

  const handleDelete = (id: number) => {
    setAttendance((prev) => prev.filter((r) => r.id !== id));
    message.success("Record deleted!");
  };

  const columns = [
    {
      title: "Talaba",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "Kurs",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Guruh",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Present" ? "green" : "red"}>
          {status === "Present" ? "Kelgan" : "Kelmagan"}
        </Tag>
      ),
    },
    {
      title: "Amallar",
      key: "action",
      render: (_: any, record: AttendanceRecord) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => showModal(record)}>
            Tahrirlash
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            O‘chirish
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal */}
      <Modal
        title={editingRecord ? "Tahrirlash" : "Yangi record qo‘shish"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => {
          const form = document.getElementById("attendance-form") as any;
          if (form)
            handleSave({
              student: form.student.value,
              course: form.course.value,
              group: form.group.value,
              date: form.date.value,
              status: form.status.value,
            });
        }}
      >
        <form id="attendance-form" className="flex flex-col gap-3">
          <Input
            name="student"
            placeholder="Talaba ismi"
            defaultValue={editingRecord?.student}
          />
          <Input
            name="course"
            placeholder="Kurs"
            defaultValue={editingRecord?.course}
          />
          <Input
            name="group"
            placeholder="Guruh"
            defaultValue={editingRecord?.group}
          />
          <Input name="date" type="date" defaultValue={editingRecord?.date} />
          <Select
            name="status"
            defaultValue={editingRecord?.status}
            style={{ width: "100%" }}
          >
            <Select.Option value="Present">Kelgan</Select.Option>
            <Select.Option value="Absent">Kelmagan</Select.Option>
          </Select>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
