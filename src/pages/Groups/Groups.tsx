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
import { useTranslation } from "react-i18next";

// Mock data
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
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form] = Form.useForm();
  const {t} = useTranslation();
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
        message.success("Guruh yangilandi");
      } else {
        setGroups((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success("Yangi guruh qo‘shildi");
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    message.success("Guruh o‘chirildi");
  };
  const columns = [
    {
      title: t("group"),
      dataIndex: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500">{record.course}</div>
          </div>
        </div>
      ),
    },
    { title: t("course"), dataIndex: "course" },
    { title: t("teacher"), dataIndex: "teacher" },
    {
      title: t("students"),
      dataIndex: "students",
      render: (count) => `${count} ta`,
    },
    {
      title: t("status"),
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
      title: t("actions"),
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <button onClick={() => showModal(record)}>
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </button>
          <Popconfirm
            title={t("confirmDelete")}
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
          title={t("groupsCount")}
          count={filteredGroups.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("searchGroup")}
          buttonText={t("addGroup")}
          onButtonClick={() => showModal()}
        />

        <div className="overflow-x-auto mt-4">
          <Table
            columns={columns}
            dataSource={filteredGroups}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </div>

        <Modal
          title={editingGroup ? t("editGroup") : t("addGroup")}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText={t("save")}
          cancelText={t("cancel")}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label={t("groupName")} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="course" label={t("course")} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="teacher"
              label={t("teacher")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="students"
              label={t("studentsCount")}
              rules={[{ required: true }]}
            >
              <Input type="number" min={0} />
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

export default Groups;
