import { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { PencilIcon, TrashBinIcon, UserIcon } from "../../icons";
import ListHeader from "../../components/ListHeader/ListHeader";
import { useTheme } from "../../context/ThemeContext";

// Mock data
const initialStudents = [
  {
    id: 1,
    name: "Aliyev Jamshid",
    course: "Frontend",
    phone: "+998 90 111 22 33",
    email: "jamshid@student.uz",
    group: "FE-01",
    status: "Faol",
  },
  {
    id: 2,
    name: "Qodirova Mohira",
    course: "Backend",
    phone: "+998 91 222 33 44",
    email: "mohira@student.uz",
    group: "BE-02",
    status: "Faol",
  },
  {
    id: 3,
    name: "Rustamov Aziz",
    course: "Python",
    phone: "+998 99 333 44 55",
    email: "aziz@student.uz",
    group: "PY-01",
    status: "Ta'tilda",
  },
];

const Students = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
  );

  const showModal = (student = null) => {
    setEditingStudent(student);
    student ? form.setFieldsValue(student) : form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingStudent) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id ? { ...s, ...values } : s
          )
        );
        message.success("Talaba yangilandi");
      } else {
        setStudents((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success("Talaba qo‘shildi");
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    message.success("Talaba o‘chirildi");
  };

  const columns = [
    {
      title: "Talaba",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    { title: "Kurs", dataIndex: "course" },
    { title: "Guruh", dataIndex: "group" },
    { title: "Telefon", dataIndex: "phone" },
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
          <button onClick={() => showModal(record)}>
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </button>
          <Popconfirm
            title="O‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <button>
              <TrashBinIcon className="w-5 h-5 text-red-600" />
            </button>
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
      <div className="p-4 bg-white dark:bg-gray-900">
        <ListHeader
          title="Talabalar soni"
          count={filteredStudents.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Talabani qidirish..."
          buttonText="Talaba qo‘shish"
          onButtonClick={() => showModal()}
        />

        <div className="overflow-x-auto mt-4">
          <Table
            columns={columns}
            dataSource={filteredStudents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </div>

        <Modal
          title={editingStudent ? "Talabani tahrirlash" : "Talaba qo‘shish"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText="Saqlash"
          cancelText="Bekor qilish"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Ism familiya" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="course" label="Kurs" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="group" label="Guruh" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="status" label="Holati" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Faol">Faol</Select.Option>
                <Select.Option value="Ta'tilda">Ta'tilda</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Students;
