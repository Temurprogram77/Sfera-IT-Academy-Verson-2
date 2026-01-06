import { useState } from "react";
import { PencilIcon, TrashBinIcon, UserIcon } from "../../icons";
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
} from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";

// Static mock data
const initialGroups = [
  {
    id: 1,
    name: "FE-01",
    course: "Frontend",
    teacher: "Abdullaev Ahmad",
    students: 18,
    status: "Faol",
  },
  {
    id: 2,
    name: "BE-02",
    course: "Backend",
    teacher: "Karimova Gulnoza",
    students: 15,
    status: "Faol",
  },
  {
    id: 3,
    name: "PY-01",
    course: "Python",
    teacher: "Oripov Sardor",
    students: 10,
    status: "Ta'tilda",
  },
];

const Groups = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form] = Form.useForm();

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModal = (group = null) => {
    setEditingGroup(group);
    group ? form.setFieldsValue(group) : form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingGroup) {
        setGroups((prev) =>
          prev.map((g) => (g.id === editingGroup.id ? { ...g, ...values } : g))
        );
        message.success("Guruh muvaffaqiyatli yangilandi!");
      } else {
        setGroups((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success("Yangi guruh muvaffaqiyatli qo‘shildi!");
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    message.success("Guruh muvaffaqiyatli o‘chirildi!");
  };

  const columns = [
    {
      title: "Guruh",
      dataIndex: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.course}</div>
          </div>
        </div>
      ),
    },
    { title: "Kurs", dataIndex: "course", key: "course" },
    { title: "O‘qituvchi", dataIndex: "teacher", key: "teacher" },
    { title: "Talabalar", dataIndex: "students", key: "students", render: (count) => `${count} ta` },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            text === "Faol"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Amallar",
      key: "action",
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <button onClick={() => showModal(record)} className="text-brand-600 hover:text-brand-800">
            <PencilIcon className="w-5 h-5" />
          </button>
          <Popconfirm
            title="Haqiqatan ham o‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <button className="text-red-600 hover:text-red-800">
              <TrashBinIcon className="w-5 h-5" />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-2 lg:p-1">
      {/* Header */}
      <ListHeader
        title="Guruhlar soni"
        count={filteredGroups.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Guruhni qidirish..."
        buttonText="Guruh qo‘shish"
        onButtonClick={() => showModal()}
      />

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredGroups}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            itemRender: (page, type, originalElement) => {
              if (type === "prev") return <button className="px-3 py-1 border rounded">Oldingi</button>;
              if (type === "next") return <button className="px-3 py-1 border rounded">Keyingi</button>;
              return originalElement;
            },
          }}
          scroll={{ x: 900 }} // mobil scroll
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingGroup ? "Guruhni tahrirlash" : "Yangi guruh qo‘shish"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
        zIndex={1000}
        okButtonProps={{ style: { backgroundColor: "#18A752", border: "none" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Guruh nomi" rules={[{ required: true }]}>
            <Input placeholder="Masalan: FE-01" />
          </Form.Item>

          <Form.Item name="course" label="Kurs" rules={[{ required: true }]}>
            <Input placeholder="Masalan: Frontend" />
          </Form.Item>

          <Form.Item name="teacher" label="O‘qituvchi" rules={[{ required: true }]}>
            <Input placeholder="O‘qituvchi ismi" />
          </Form.Item>

          <Form.Item name="students" label="Talabalar soni" rules={[{ required: true }]}>
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="status" label="Holati" rules={[{ required: true }]}>
            <Select placeholder="Holatini tanlang">
              <Select.Option value="Faol">Faol</Select.Option>
              <Select.Option value="Ta'tilda">Ta'tilda</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Groups;
