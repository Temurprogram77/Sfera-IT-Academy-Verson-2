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
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

// Mock data
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
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

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
          prev.map((p) =>
            p.id === editingParent.id ? { ...p, ...values } : p
          )
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
          <button onClick={() => showModal(record)}>
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </button>
          <Popconfirm
            title={t("confirm_delete")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("yes")}
            cancelText={t("no")}
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
          title={t("total_parents")}
          count={filteredParents.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("search_parent")}
          buttonText={t("add_parent")}
          onButtonClick={() => showModal()}
        />

        <div className="overflow-x-auto mt-4">
          <Table
            columns={columns}
            dataSource={filteredParents}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </div>

        <Modal
          title={editingParent ? t("edit_parent") : t("add_parent")}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText={t("save")}
          cancelText={t("cancel")}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label={t("full_name")} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="student" label={t("child")} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="phone" label={t("phone")} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("email")}
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="status" label={t("status")} rules={[{ required: true }]}>
              <Select>
                <Select.Option value="active">{t("active")}</Select.Option>
                <Select.Option value="on_leave">{t("on_leave")}</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Parents;
