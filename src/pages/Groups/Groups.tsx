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
  Input as AntInput,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
          prev.map((g) =>
            g.id === editingGroup.id ? { ...g, ...values } : g
          )
        );
        message.success("Guruh muvaffaqiyatli yangilandi!");
      } else {
        setGroups((prev) => [
          ...prev,
          { id: Date.now(), ...values },
        ]);
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
            <div className="text-sm font-medium text-gray-900">
              {record.name}
            </div>
            <div className="text-sm text-gray-500">
              {record.course}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Kurs",
      dataIndex: "course",
    },
    {
      title: "O‘qituvchi",
      dataIndex: "teacher",
    },
    {
      title: "Talabalar",
      dataIndex: "students",
      render: (count) => `${count} ta`,
    },
    {
      title: "Holati",
      dataIndex: "status",
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
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => showModal(record)}
            className="text-brand-600 hover:text-brand-800"
          >
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-base font-medium text-gray-700">
            Guruhlar soni:{" "}
            <span className="font-bold text-gray-900">
              {filteredGroups.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <AntInput
              placeholder="Guruhni qidirish..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 h-10 rounded-lg border-gray-300"
              allowClear
            />

            <button
              onClick={() => showModal()}
              className="flex items-center justify-center gap-2 bg-[#18A752] text-white px-5 py-2 h-10 rounded-lg hover:bg-[#118740] transition whitespace-nowrap"
            >
              <span className="text-[30px]">+</span>
              Guruh qo‘shish
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredGroups}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === "prev")
              return (
                <button className="px-3 py-1 border rounded">
                  Oldingi
                </button>
              );
            if (type === "next")
              return (
                <button className="px-3 py-1 border rounded">
                  Keyingi
                </button>
              );
            return originalElement;
          },
        }}
      />

      {/* Modal */}
      <Modal
        title={
          editingGroup ? "Guruhni tahrirlash" : "Yangi guruh qo‘shish"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={600}
        zIndex={1000}
        okButtonProps={{
          style: { backgroundColor: "#18A752", border: "none" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Guruh nomi"
            rules={[{ required: true }]}
          >
            <Input placeholder="Masalan: FE-01" />
          </Form.Item>

          <Form.Item
            name="course"
            label="Kurs"
            rules={[{ required: true }]}
          >
            <Input placeholder="Masalan: Frontend" />
          </Form.Item>

          <Form.Item
            name="teacher"
            label="O‘qituvchi"
            rules={[{ required: true }]}
          >
            <Input placeholder="O‘qituvchi ismi" />
          </Form.Item>

          <Form.Item
            name="students"
            label="Talabalar soni"
            rules={[{ required: true }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Holati"
            rules={[{ required: true }]}
          >
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
