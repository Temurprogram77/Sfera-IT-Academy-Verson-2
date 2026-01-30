import { useState } from "react";
import {
  Form,
  Select,
  message,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import TableComponent from "../../components/TableComponent/TableComponent";

// Types
type Group = {
  id: number;
  name: string;
  course: string;
  teacher: string;
  students: number;
  status: "Faol" | "Ta'tilda";
};

// Mock data
const initialGroups: Group[] = [
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
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showModal = (group: Group | null = null) => {
    setEditingGroup(group);

    if (group) {
      form.setFieldsValue(group);
    } else {
      form.resetFields();
    }

    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<Group, "id">) => {
      if (editingGroup) {
        setGroups((prev) =>
          prev.map((g) => (g.id === editingGroup.id ? { ...g, ...values } : g))
        );
        message.success("Guruh yangilandi");
      } else {
        setGroups((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success("Yangi guruh qo‘shildi");
      }
      setIsModalVisible(false);
    });
  };

  const columnsConfig = [
    {
      key: "name",
      title: t("group"),
      render: (group: Group) => group.name,
    },
    {
      key: "course",
      title: t("course"),
      render: (group: Group) => group.course,
    },
    {
      key: "teacher",
      title: t("teacher"),
      render: (group: Group) => group.teacher,
    },
    {
      key: "students",
      title: t("students"),
      render: (group: Group) => `${group.students} ta`,
    },
    {
      key: "status",
      title: t("status"),
      render: (group: Group) => (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            group.status === "Faol"
              ? "bg-[#03906d] text-white"
              : "text-white bg-yellow-500"
          }`}
        >
          {group.status}
        </span>
      ),
    },
  ];

  const modalFields = [
    {
      name: "name",
      label: t("groupName"),
      component: <InputComponent />,
      rules: [{ required: true }],
    },
    {
      name: "course",
      label: t("course"),
      component: <InputComponent />,
      rules: [{ required: true }],
    },
    {
      name: "teacher",
      label: t("teacher"),
      component: <InputComponent />,
      rules: [{ required: true }],
    },
    {
      name: "students",
      label: t("studentsCount"),
      component: <InputComponent type="number" />,
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
  ];

  const searchKeys: (keyof Group)[] = ["name", "course", "teacher"];

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
        <TableComponent<Group>
          data={filteredGroups}  
          columnsConfig={columnsConfig}
          modalFields={modalFields}
          searchKeys={searchKeys}
          itemName={t("group")}  
        />
      </div>
      
      <ModalComponent
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        title={editingGroup ? t("editGroup") : t("addGroup")}
        okText={t("save")}
        cancelText={t("cancel")}
      >
        <Form form={form} layout="vertical">
          <InputComponent
            name="name"
            label={t("groupName")}
            rules={[{ required: true }]}
          />
          <InputComponent
            name="course"
            label={t("course")}
            rules={[{ required: true }]}
          />
          <InputComponent
            name="teacher"
            label={t("teacher")}
            rules={[{ required: true }]}
          />
          <InputComponent
            name="students"
            label={t("studentsCount")}
            type="number"
            rules={[{ required: true }]}
          />
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

export default Groups;
