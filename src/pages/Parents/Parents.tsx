import { useState, useMemo } from "react";
import {
  Form,
  Select,
  message,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import TableComponent from "../../components/TableComponent/TableComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import SelectComponent from "../../components/SelectComponent/SelectComponent";

interface Parent {
  id: number;
  name: string;
  student: string;
  phone: string;
  email: string;
  status: "active" | "on_leave";
}

const initialParents: Parent[] = [
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

  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [form] = Form.useForm();

  const filteredParents = useMemo(() => {
    return parents.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );
  }, [parents, searchTerm]);

  const showModal = (parent: Parent | null = null) => {
    setEditingParent(parent);
    parent ? form.setFieldsValue(parent) : form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();

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
  };

  return (
    <ConfigProvider
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
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
        <ListHeader
          title={t("total_parents")}
          count={filteredParents.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("search_parent")}
          buttonText={t("add_parent")}
          onButtonClick={() => showModal()}
        />

        <TableComponent<Parent>
          data={initialParents}
          title="Ota-onalar"
          itemName={t("parent")}
          searchKeys={["name", "student", "phone"]}
          columnsConfig={[
            {
              title: t("parent"),
              dataIndex: "name",
              render: (_: any, record: Parent) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {/* Icon */}
                  </div>
                  <div>
                    <div className="font-medium">{record.name}</div>
                    <div className="text-xs text-gray-500">{record.email}</div>
                  </div>
                </div>
              ),
            },
            {
              title: t("child"),
              dataIndex: "student",
            },
            {
              title: t("phone"),
              dataIndex: "phone",
            },
            {
              title: t("status"),
              dataIndex: "status",
              render: (status: string) => (
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    status === "active"
                      ? "bg-[#03906d] text-white"
                      : "text-white bg-yellow-500"
                  }`}
                >
                  {status === "active" ? "Faol" : "Ta’til"}
                </span>
              ),
            },
          ]}
          modalFields={[
            {
              name: "name",
              label: t("full_name"),
              component: <InputComponent />,
              rules: [{ required: true }],
            },
            {
              name: "student",
              label: t("child"),
              component: <InputComponent />,
              rules: [{ required: true }],
            },
            {
              name: "phone",
              label: t("phone"),
              component: <InputComponent />,
              rules: [{ required: true }],
            },
            {
              name: "email",
              label: t("email"),
              component: <InputComponent />,
              rules: [{ required: true, type: "email" }],
            },
            {
              name: "status",
              label: t("status"),
              component: (
                <Select>
                  <Select.Option value="active">Faol</Select.Option>
                  <Select.Option value="on_leave">Ta’til</Select.Option>
                </Select>
              ),
              rules: [{ required: true }],
            },
          ]}
        />

        <ModalComponent
          title={editingParent ? t("edit_parent") : t("add_parent")}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText={t("save")}
          cancelText={t("cancel")}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label={t("full_name")}
              rules={[{ required: true }]}
            >
              <InputComponent />
            </Form.Item>

            <Form.Item
              name="student"
              label={t("child")}
              rules={[{ required: true }]}
            >
              <InputComponent />
            </Form.Item>

            <Form.Item
              name="phone"
              label={t("phone")}
              rules={[{ required: true }]}
            >
              <InputComponent />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("email")}
              rules={[{ required: true, type: "email" }]}
            >
              <InputComponent />
            </Form.Item>

            <Form.Item
              name="status"
              label={t("status")}
              rules={[{ required: true }]}
            >
              <SelectComponent
                value={status}
                onChange={(val) => setStatus(val)}
                options={[
                  { label: t("active"), value: "active" },
                  { label: t("on_leave"), value: "on_leave" },
                ]}
              />
            </Form.Item>
          </Form>
        </ModalComponent>
      </div>
    </ConfigProvider>
  );
};

export default Parents;
