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
import { useTranslation } from "react-i18next";
import ListHeader from "../../components/ListHeader/ListHeader";

// Static mock data
const initialParents = [
  {
    id: 1,
    name: "Karimov Anvar",
    student: "Aliyev Jamshid",
    phone: "+998 90 555 66 77",
    email: "anvar@parent.uz",
    status: "active",
  },
  {
    id: 2,
    name: "Qodirova Dilnoza",
    student: "Qodirova Mohira",
    phone: "+998 91 666 77 88",
    email: "dilnoza@parent.uz",
    status: "active",
  },
  {
    id: 3,
    name: "Rustamov Bahodir",
    student: "Rustamov Aziz",
    phone: "+998 99 777 88 99",
    email: "bahodir@parent.uz",
    status: "on_leave",
  },
];

const Parents = () => {
  const { t } = useTranslation();
  const [parents, setParents] = useState(initialParents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [form] = Form.useForm();

  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  const showModal = (parent = null) => {
    setEditingParent(parent);
    parent ? form.setFieldsValue(parent) : form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingParent) {
        setParents((prev) =>
          prev.map((p) => (p.id === editingParent.id ? { ...p, ...values } : p))
        );
        message.success(t("parent_updated"));
      } else {
        setParents((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success(t("parent_added"));
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setParents((prev) => prev.filter((p) => p.id !== id));
    message.success(t("parent_deleted"));
  };

  const columns = [
    {
      title: t("parent"),
      dataIndex: "name",
      render: (_, record) => (
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
    { title: t("child"), dataIndex: "student" },
    { title: t("phone"), dataIndex: "phone" },
    {
      title: t("status"),
      dataIndex: "status",
      render: (text) => (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            text === "active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {text === "active" ? t("active") : t("on_leave")}
        </span>
      ),
    },
    {
      title: t("actions"),
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => showModal(record)}
            className="text-brand-600 hover:text-brand-800"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <Popconfirm
            title={t("confirm_delete")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("yes")}
            cancelText={t("no")}
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
        title={t("total_parents")}
        count={filteredParents.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("search_parent")}
        buttonText={t("add_parent")}
        onButtonClick={() => showModal()}
      >
        {/* Optional filter */}
      </ListHeader>

      {/* Responsive Table wrapper */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredParents}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            itemRender: (page, type, originalElement) => {
              if (type === "prev")
                return (
                  <button className="px-3 py-1 border rounded">
                    {t("prev")}
                  </button>
                );
              if (type === "next")
                return (
                  <button className="px-3 py-1 border rounded">
                    {t("next")}
                  </button>
                );
              return originalElement;
            },
          }}
          scroll={{ x: 800 }} // table kengligi mobil uchun scroll
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingParent ? t("edit_parent") : t("add_parent")}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={t("save")}
        cancelText={t("cancel")}
        width={600}
        zIndex={1000}
        okButtonProps={{
          style: { backgroundColor: "#18A752", border: "none" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t("full_name")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="student"
            label={t("child")}
            rules={[{ required: true }]}
          >
            <Input placeholder={t("child_name")} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("phone")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("email")}
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label={t("status")}
            rules={[{ required: true }]}
          >
            <Select placeholder={t("select_status")}>
              <Select.Option value="active">{t("active")}</Select.Option>
              <Select.Option value="on_leave">{t("on_leave")}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Parents;
