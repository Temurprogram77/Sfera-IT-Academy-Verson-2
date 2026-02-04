import { useState } from "react";
import { Form, Select, message } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import { useTranslation } from "react-i18next";
import ModalComponent from "../../components/Modal/Modal";
import InputComponent from "../../components/Input/Input";
import TableComponent from "../../components/Table/Table";

// Types
type Group = {
  id: number;
  name: string;
  course: string;
  teacher: string;
  students: number;
  status: "Faol" | "Ta'tilda";
};

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]); // Fake datalar o'chirildi
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.teacher.toLowerCase().includes(searchTerm.toLowerCase()),
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
          prev.map((g) => (g.id === editingGroup.id ? { ...g, ...values } : g)),
        );
        message.success(t("Guruh yangilandi"));
      } else {
        setGroups((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success(t("Yangi guruh qo‘shildi"));
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

  const searchKeys: (keyof Group)[] = ["name", "course", "teacher"];

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen">
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
          searchKeys={searchKeys}
          itemName={t("group")}
          onEdit={(record) => showModal(record)}
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
          <Form.Item
            name="name"
            label={t("groupName")}
            rules={[{ required: true }]}
          >
            <InputComponent />
          </Form.Item>

          <Form.Item
            name="course"
            label={t("course")}
            rules={[{ required: true }]}
          >
            <InputComponent />
          </Form.Item>

          <Form.Item
            name="teacher"
            label={t("teacher")}
            rules={[{ required: true }]}
          >
            <InputComponent />
          </Form.Item>

          <Form.Item
            name="students"
            label={t("studentsCount")}
            rules={[{ required: true }]}
          >
            <InputComponent type="number" />
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
  );
};

export default Groups;
