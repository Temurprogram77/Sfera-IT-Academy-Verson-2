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
import { toast } from "sonner";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import TableComponent from "../../components/TableComponent/TableComponent";

// Mock data
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
];

const Teachers = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form] = Form.useForm();

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.includes(searchTerm)
  );

  const showModal = (teacher = null) => {
    setEditingTeacher(teacher);
    teacher ? form.setFieldsValue(teacher) : form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingTeacher) {
        setTeachers((prev) =>
          prev.map((t) =>
            t.id === editingTeacher.id ? { ...t, ...values } : t
          )
        );
        toast.success(t("teacher_updated"));
      } else {
        setTeachers((prev) => [...prev, { id: Date.now(), ...values }]);
        toast.success(t("teacher_added"));
      }
      setIsModalVisible(false);
    });
  };


  return (
    <ConfigProvider
      key={theme} // 🔥 MUHIM
      theme={{
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: theme === "dark" ? "#111827" : "#ffffff",
          colorText: theme === "dark" ? "#e5e7eb" : "#111827",
          colorBorder: theme === "dark" ? "#374151" : "#e5e7eb",
        },
        components: {
          Modal: {
            contentBg: theme === "dark" ? "#111827" : "#ffffff",
            headerBg: theme === "dark" ? "#111827" : "#ffffff",
            footerBg: theme === "dark" ? "#111827" : "#ffffff",
          },
        },
      }}
    >
      <div className="p-4 bg-white dark:bg-gray-900">
        <ListHeader
          title={t("teachers_count")}
          count={filteredTeachers.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("search_teacher")}
          buttonText={t("add_teacher")}
          onButtonClick={() => showModal()}
        />

        <div className="overflow-x-auto mt-4">
          <TableComponent
            data={initialTeachers}
            title="O‘qituvchilar"
            itemName="O‘qituvchi"
            searchKeys={["name", "subject", "phone"]}
            columnsConfig={[
              {
                title: t("teacher"),
                dataIndex: "name",
                render: (_: any, record: any) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {/* Icon */}
                    </div>
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-xs text-gray-500">
                        {record.email}
                      </div>
                    </div>
                  </div>
                ),
              },
              { title: t("subject"), dataIndex: "subject" },
              { title: t("phone"), dataIndex: "phone" },
              {
                title: t("groups"),
                dataIndex: "groups",
                render: (v) => `${v} ta`,
              },
              {
                title: t("status"),
                dataIndex: "status",
                render: (text: string) => (
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
            ]}
            modalFields={[
              {
                name: "name",
                label: t("fullname"),
                component: <Input />,
                rules: [{ required: true }],
              },
              {
                name: "subject",
                label: t("subject"),
                component: <Input />,
                rules: [{ required: true }],
              },
              {
                name: "phone",
                label: t("phone"),
                component: <Input />,
                rules: [{ required: true }],
              },
              {
                name: "email",
                label: t("email"),
                component: <Input />,
                rules: [{ required: true, type: "email" }],
              },
              {
                name: "groups",
                label: t("groups"),
                component: <Input type="number" />,
                rules: [{ required: true }],
              },
              {
                name: "status",
                label: t("status"),
                component: (
                  <Select>
                    <Select.Option value="Faol">Faol</Select.Option>
                    <Select.Option value="Ta'tilda">Ta'tilda</Select.Option>
                  </Select>
                ),
                rules: [{ required: true }],
              },
            ]}
          />
        </div>

        <ModalComponent
          open={isModalVisible}
          title={editingTeacher ? t("edit_teacher") : t("add_teacher")}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText={t("save")}
          cancelText={t("cancel")}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label={t("fullname")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="subject"
              label={t("subject")}
              rules={[{ required: true }]}
            >
              <Input />
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
              name="groups"
              label={t("groups")}
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="status"
              label={t("status")}
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Faol">Faol</Select.Option>
                <Select.Option value="Ta'tilda">Ta'tilda</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </ModalComponent>
      </div>
    </ConfigProvider>
  );
};

export default Teachers;
