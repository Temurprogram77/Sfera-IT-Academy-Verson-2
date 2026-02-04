import { useState, useMemo } from "react";
import { Form, theme as antdTheme } from "antd";
import { useTheme } from "../../context/ThemeContext";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import TableComponent from "../../components/TableComponent/TableComponent";
import SelectComponent from "../../components/Select/Select";
import InputComponent from "../../components/InputComponent/InputComponent";
import FormWrapper from "../../components/FormWrapper/FormWrapper";

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Admin";
  status: "Faol" | "Bloklangan";
}

const initialAdmins: Admin[] = [
  {
    id: 1,
    name: "Karimov Aziz",
    email: "aziz@admin.uz",
    phone: "+998 90 111 22 33",
    role: "Super Admin",
    status: "Faol",
  },
  {
    id: 2,
    name: "Ismoilova Dilnoza",
    email: "dilnoza@admin.uz",
    phone: "+998 91 222 33 44",
    role: "Admin",
    status: "Faol",
  },
  {
    id: 3,
    name: "Rustamov Jamshid",
    email: "jamshid@admin.uz",
    phone: "+998 99 333 44 55",
    role: "Admin",
    status: "Bloklangan",
  },
];

const Admins = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const { t } = useTranslation();

  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [form] = Form.useForm();

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search),
    );
  }, [admins, search]);

  const openModal = (admin: Admin | null = null) => {
    setEditingAdmin(admin);
    admin ? form.setFieldsValue(admin) : form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();

    if (editingAdmin) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === editingAdmin.id ? { ...a, ...values } : a)),
      );
      toast.success(t("admin_updated"));
    } else {
      setAdmins((prev) => [...prev, { id: Date.now(), ...values }]);
      toast.success(t("admin_added"));
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
      <ListHeader
        title={t("admins")}
        count={filteredAdmins.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("searchAdmin")}
        buttonText={t("addAdmin")}
        onButtonClick={() => openModal()}
      />

      <TableComponent<Admin>
        data={initialAdmins}
        title={t("admins")}
        itemName={t("admin")}
        searchKeys={["name", "email", "phone"]}
        columnsConfig={[
          {
            title: t("admin"),
            dataIndex: "name",
            render: (_: any, record: any) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {/* User Icon */}
                </div>
                <div>
                  <div className="font-medium">{record.name}</div>
                  <div className="text-xs text-gray-500">{record.email}</div>
                </div>
              </div>
            ),
          },
          { title: t("phone"), dataIndex: "phone" },
          {
            title: t("role"),
            dataIndex: "role",
            render: (role: string) => (
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  role === "Super Admin"
                    ? "dark:bg-gray-700 dark:text-white bg-blue-100 text-blue-800"
                    : "bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {role}
              </span>
            ),
          },
          {
            title: t("status"),
            dataIndex: "status",
            render: (status: string) => (
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  status === "Faol"
                    ? "bg-[#03906d] text-white"
                    : "text-white bg-red-800"
                }`}
              >
                {status}
              </span>
            ),
          },
        ]}
        modalFields={[
          {
            name: "name",
            label: t("fullname"),
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
            name: "phone",
            label: t("phone"),
            component: <InputComponent />,
            rules: [{ required: true }],
          },
          {
            name: "role",
            label: t("role"),
            component: (
              <SelectComponent
                options={[
                  { label: "Super Admin", value: "Super Admin" },
                  { label: "Admin", value: "Admin" },
                ]}
              />
            ),

            rules: [{ required: true }],
          },
          {
            name: "status",
            label: t("status"),
            component: (
              <SelectComponent
                options={[
                  { label: "Faol", value: "Faol" },
                  { label: "Bloklangan", value: "Bloklangan" },
                ]}
              />
            ),
            rules: [{ required: true }],
          },
        ]}
      />

      <ModalComponent
        open={isModalOpen}
        title={editingAdmin ? t("editAdmin") : t("addAdmin")}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <FormWrapper form={form} onFinish={handleSave}>
          <Form.Item
            name="name"
            label={t("fullname")}
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
            name="phone"
            label={t("phone")}
            rules={[{ required: true }]}
          >
            <InputComponent />
          </Form.Item>

          <Form.Item name="role" label={t("role")} rules={[{ required: true }]}>
            <SelectComponent
              options={[
                { label: "Super Admin", value: "Super Admin" },
                { label: "Admin", value: "Admin" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={t("status")}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={[
                { label: "Faol", value: "Faol" },
                { label: "Bloklangan", value: "Bloklangan" },
              ]}
            />
          </Form.Item>
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default Admins;
