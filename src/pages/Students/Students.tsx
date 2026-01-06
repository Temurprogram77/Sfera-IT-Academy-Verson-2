import { useState } from "react";
import { PencilIcon, TrashBinIcon, UserIcon } from "../../icons";
import { Table, Modal, Form, Input, Select, Popconfirm, message } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";

// Static mock data
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
        message.success("Talaba muvaffaqiyatli yangilandi!");
      } else {
        setStudents((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success("Yangi talaba muvaffaqiyatli qo‘shildi!");
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    message.success("Talaba muvaffaqiyatli o‘chirildi!");
  };

  const columns = [
    {
      title: "Talaba",
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
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
      <ListHeader
        title="Talabalar soni"
        count={filteredStudents.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Talabani qidirish..."
        buttonText="Talaba qo‘shish"
        onButtonClick={() => showModal()}
      >
        {/* Optional filter */}
      </ListHeader>

      {/* Responsive Table wrapper */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            itemRender: (page, type, originalElement) => {
              if (type === "prev")
                return <button className="px-3 py-1 border rounded">Oldingi</button>;
              if (type === "next")
                return <button className="px-3 py-1 border rounded">Keyingi</button>;
              return originalElement;
            },
          }}
          scroll={{ x: 800 }} // minimal kenglik scroll uchun
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingStudent ? "Talabani tahrirlash" : "Yangi talaba qo‘shish"}
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

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
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

export default Students;
