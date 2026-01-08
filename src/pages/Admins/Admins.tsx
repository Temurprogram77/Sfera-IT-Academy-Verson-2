import { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Popconfirm,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { useTheme } from "../../context/ThemeContext";
import { PencilIcon, TrashBinIcon, UserIcon } from "../../icons";
import ListHeader from "../../components/ListHeader/ListHeader";

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

  const [admins, setAdmins] = useState(initialAdmins);
  const [search, setSearch] = useState("");

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search)
    );
  }, [admins, search]);

  const handleDelete = (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  const columns = [
    {
      title: "Admin",
      dataIndex: "name",
      render: (_: any, record: Admin) => (
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
    {
      title: "Telefon",
      dataIndex: "phone",
    },
    {
      title: "Roli",
      dataIndex: "role",
      render: (role: string) => (
        <Tag color={role === "Super Admin" ? "purple" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Holati",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            status === "Faol"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Amallar",
      render: (_: any, record: Admin) => (
        <div className="flex justify-end gap-3">
          <button>
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </button>
          <Popconfirm
            title="Adminni o‘chirmoqchimisiz?"
            okText="Ha"
            cancelText="Yo‘q"
            onConfirm={() => handleDelete(record.id)}
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
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl">
        <ListHeader
          title="Admins"
          count={filteredAdmins.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Admin qidirish"
          buttonText="Admin qo‘shish"
          onButtonClick={() => {}}
        />

        <Table
          columns={columns}
          dataSource={filteredAdmins}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 800 }}
        />
      </div>
    </ConfigProvider>
  );
};

export default Admins;
