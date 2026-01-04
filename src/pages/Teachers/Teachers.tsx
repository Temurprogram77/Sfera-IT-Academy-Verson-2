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
const initialTeachers = [
  {
    id: 1,
    name: "Abdullaev Ahmad",
    subject: "Frontend",
    phone: "+998 90 123 45 67",
    email: "ahmad@school.uz",
    groups: 5,
    status: "Faol",
  },
  {
    id: 2,
    name: "Karimova Gulnoza",
    subject: "Backend",
    phone: "+998 91 234 56 78",
    email: "gulnoza@school.uz",
    groups: 4,
    status: "Faol",
  },
  {
    id: 3,
    name: "Oripov Sardor",
    subject: "Python",
    phone: "+998 99 345 67 89",
    email: "sardor@school.uz",
    groups: 3,
    status: "Ta'tilda",
  },
  {
    id: 4,
    name: "Saidova Madina",
    subject: "Frontend",
    phone: "+998 93 456 78 90",
    email: "madina@school.uz",
    groups: 6,
    status: "Faol",
  },
  {
    id: 5,
    name: "To'rayev Botir",
    subject: "Java",
    phone: "+998 97 567 89 01",
    email: "botir@school.uz",
    groups: 2,
    status: "Faol",
  },
];

const Teachers = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form] = Form.useForm();

  // Qidiruv filtri
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.includes(searchTerm)
  );

  const showModal = (teacher = null) => {
    setEditingTeacher(teacher);
    if (teacher) {
      form.setFieldsValue(teacher);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingTeacher) {
          setTeachers((prev) =>
            prev.map((t) =>
              t.id === editingTeacher.id ? { ...t, ...values } : t
            )
          );
          message.success("O'qituvchi muvaffaqiyatli yangilandi!");
        } else {
          const newTeacher = {
            id: Math.max(...teachers.map((t) => t.id)) + 1,
            ...values,
          };
          setTeachers((prev) => [...prev, newTeacher]);
          message.success("Yangi o'qituvchi muvaffaqiyatli qo'shildi!");
        }
        setIsModalVisible(false);
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    message.success("O'qituvchi muvaffaqiyatli o'chirildi!");
  };

  const columns = [
    {
      title: "O'qituvchi",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {record.name}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Guruh Nomi",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Guruhlar",
      dataIndex: "groups",
      key: "groups",
      render: (text) => `${text} ta`,
    },
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
          <button
            onClick={() => showModal(record)}
            className="text-brand-600 hover:text-brand-800"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <Popconfirm
            title="Haqiqatan ham o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
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
      {/* Tepa qism: soni + search + tugma (rasmga mos dizayn) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-base font-medium text-gray-700">
            O'qituvchilar soni:{" "}
            <span className="font-bold text-gray-900">
              {filteredTeachers.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <AntInput
              placeholder="O'qituvchini qidirish..."
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
              {/* <PlusIcon className="w-5 h-5" /> */}
              <span className="text-[30px]">+</span>
              O'qituvchi qo'shish
            </button>
          </div>
        </div>
      </div>

      {/* Jadval */}
      <Table
        columns={columns}
        dataSource={filteredTeachers}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === "prev")
              return (
                <button className="px-3 py-1 border rounded">Oldingi</button>
              );
            if (type === "next")
              return (
                <button className="px-3 py-1 border rounded">Keyingi</button>
              );
            return originalElement;
          },
        }}
      />

      {/* Modal - Qo'shish va Tahrirlash */}
      <Modal
        title={
          editingTeacher
            ? "O'qituvchini tahrirlash"
            : "Yangi o'qituvchi qo'shish"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
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
            label="Ism familiya"
            rules={[
              { required: true, message: "Iltimos, ism familiyani kiriting!" },
            ]}
          >
            <Input placeholder="Masalan: Abdullaev Ahmad" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Guruh nomi (fan)"
            rules={[
              { required: true, message: "Iltimos, guruh nomini kiriting!" },
            ]}
          >
            <Input placeholder="Masalan: Frontend" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon raqam"
            rules={[
              {
                required: true,
                message: "Iltimos, telefon raqamini kiriting!",
              },
            ]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Iltimos, emailni kiriting!" },
              { type: "email", message: "Noto'g'ri email formati!" },
            ]}
          >
            <Input placeholder="email@example.uz" />
          </Form.Item>

          <Form.Item
            name="groups"
            label="Guruhlar soni"
            rules={[
              { required: true, message: "Iltimos, guruhlar sonini kiriting!" },
            ]}
          >
            <Input type="number" min={0} placeholder="5" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Holati"
            rules={[{ required: true, message: "Iltimos, holatni tanlang!" }]}
          >
            <Select placeholder="Holati tanlang">
              <Select.Option value="Faol">Faol</Select.Option>
              <Select.Option value="Ta'tilda">Ta'tilda</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;
