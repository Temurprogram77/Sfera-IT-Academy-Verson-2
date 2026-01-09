import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Form,
  Popconfirm,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { PencilIcon, TrashBinIcon } from "../../icons";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "sonner";

// Tiplar
export type ColumnConfig<T> = {
  key: string;
  title: string;
  render?: (record: T) => React.ReactNode;
};

export type ModalField<T> = {
  name: keyof T | string;
  label: string;
  component: React.ReactNode;
  rules?: Parameters<typeof Form.Item>[0]["rules"];
};

interface TableComponentProps<T extends { id: number }> {
  data: T[];
  columnsConfig: ColumnConfig<T>[];
  modalFields: ModalField<T>[];
  searchKeys: (keyof T)[];
  title: string;
  itemName?: string;
}

const TableComponent = <T extends { id: number }>({
  data,
  columnsConfig,
  modalFields,
  searchKeys,
  itemName = "Item",
}: TableComponentProps<T>) => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [items, setItems] = useState<T[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [form] = Form.useForm();
  useEffect(() => {
    setSearchTerm(""); // agar kerak bo‘lsa
  }, []);
  const filteredItems = useMemo(
    () =>
      items.filter((i) =>
        searchKeys.some((key) =>
          String(i[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [items, searchTerm, searchKeys]
  );

  const showModal = (item: T | null = null) => {
  setEditingItem(item);

  if (item) {
    form.setFieldsValue(item);
  } else {
    form.resetFields();
  }

  setIsModalVisible(true);
};


  const handleSave = async () => {
    const values = await form.validateFields();

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...values } : i))
      );
      toast.success(`${itemName} yangilandi`);
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...values } as T]);
      toast.success(`Yangi ${itemName} qo‘shildi`);
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`${itemName} o‘chirildi`);
  };

  const columns = [
    ...columnsConfig.map((col) => ({
      ...col,
      render: col.render
        ? col.render
        : (record: T) => String(record[col.key as keyof T]),
    })),
    {
      title: "Amallar",
      render: (_: unknown, record: T) => (
        <div className="flex justify-end gap-3">
          <button onClick={() => showModal(record)}>
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </button>
          <Popconfirm
            title={`${itemName}ni o‘chirmoqchimisiz?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
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
        components: {
          Modal: {
            contentBg: theme === "dark" ? "#111827" : "#ffffff",
            headerBg: theme === "dark" ? "#111827" : "#ffffff",
            footerBg: theme === "dark" ? "#111827" : "#ffffff",
          },
        },
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredItems}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        </div>

        <ModalComponent
          open={isModalVisible}
          title={
            editingItem
              ? `${itemName}ni tahrirlash`
              : `Yangi ${itemName} qo‘shish`
          }
          onOk={handleSave}
          onCancel={() => setIsModalVisible(false)}
          okText="Saqlash"
          cancelText="Bekor qilish"
        >
          <Form form={form} layout="vertical">
            {modalFields.map((field) => (
              <Form.Item
                key={String(field.name)}
                name={field.name as string | number}
                label={field.label}
                rules={field.rules || []}
              >
                {field.component}
              </Form.Item>
            ))}
          </Form>
        </ModalComponent>
      </div>
    </ConfigProvider>
  );
};

export default TableComponent;
