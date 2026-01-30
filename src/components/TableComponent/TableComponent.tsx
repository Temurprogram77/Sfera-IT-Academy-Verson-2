import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Form,
  Popconfirm,
  ConfigProvider,
  theme as antdTheme,
  Modal,
  Descriptions,
  Tag,
  Space,
} from "antd";

import { PencilIcon, TrashBinIcon } from "../../icons";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/* ================= TYPES ================= */

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
  modalFields?: ModalField<T>[]; // ❗ optional
  searchKeys?: (keyof T)[];
  itemName?: string;
}

/* ================= COMPONENT ================= */

const TableComponent = <T extends { id: number }>({
  data,
  columnsConfig,
  modalFields = [],
  searchKeys = [],
  itemName = "Item",
}: TableComponentProps<T>) => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const { t } = useTranslation();

  const [items, setItems] = useState<T[]>(data);

  /* CRUD MODAL */

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  /* VIEW MODAL */

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const [form] = Form.useForm();

  /* ================= SYNC ================= */

  useEffect(() => {
    setItems(data);
  }, [data]);

  /* ================= SEARCH ================= */

  const filteredItems = useMemo(() => {
    if (!searchKeys.length) return items;

    return items.filter((i) =>
      searchKeys.some((key) =>
        String(i[key])
          .toLowerCase()
          .includes("")
      )
    );
  }, [items, searchKeys]);

  /* ================= CRUD ================= */

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
        prev.map((i) =>
          i.id === editingItem.id ? { ...i, ...values } : i
        )
      );

      toast.success(`${itemName} yangilandi`);
    } else {
      setItems((prev) => [
        ...prev,
        { id: Date.now(), ...values } as T,
      ]);

      toast.success(`Yangi ${itemName} qo‘shildi`);
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`${itemName} o‘chirildi`);
  };

  /* ================= ROW CLICK (VIEW) ================= */

  const handleRowClick = (record: T) => {
    setSelectedItem(record);
    setViewOpen(true);
  };

  /* ================= COLUMNS ================= */

  const columns = [
    ...columnsConfig.map((col) => ({
      ...col,

      render: col.render
        ? col.render
        : (record: T) =>
            String(record[col.key as keyof T]),
    })),

    modalFields.length > 0 && {
      title: t("actions"),

      render: (_: unknown, record: T) => (
        <div
          className="flex justify-end gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => showModal(record)}>
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </button>

          <Popconfirm
            title={`${itemName}${t("confirmDeleteSuffix")}`}
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
  ].filter(Boolean);

  /* ================= THEME ================= */

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark"
            ? darkAlgorithm
            : defaultAlgorithm,

        token: {
          colorBgContainer:
            theme === "dark" ? "#111827" : "#ffffff",

          colorText:
            theme === "dark" ? "#e5e7eb" : "#111827",

          colorBorder:
            theme === "dark" ? "#374151" : "#e5e7eb",
        },
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl">

        {/* TABLE */}

        <div className="overflow-x-auto">

          <Table
            columns={columns as any}
            dataSource={filteredItems}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}

            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}

            className="cursor-pointer"
          />

        </div>

        {/* CRUD MODAL */}

        {modalFields.length > 0 && (
          <ModalComponent
            open={isModalVisible}
            title={
              editingItem
                ? `${itemName} ${t("edit")}`
                : `${t("new")} ${itemName}`
            }
            onOk={handleSave}
            onCancel={() => setIsModalVisible(false)}
            okText={t("save")}
            cancelText={t("close")}
          >
            <Form form={form} layout="vertical">
              {modalFields.map((field) => (
                <Form.Item
                  key={String(field.name)}
                  name={field.name as string}
                  label={field.label}
                  rules={field.rules || []}
                >
                  {field.component}
                </Form.Item>
              ))}
            </Form>
          </ModalComponent>
        )}

        {/* VIEW MODAL */}

        <Modal
          open={viewOpen}
          footer={null}
          onCancel={() => setViewOpen(false)}
          width={700}
          title={`${itemName} ma'lumotlari`}
        >
          {selectedItem && (
            <Descriptions
              bordered
              column={1}
              responsive
            >
              {Object.entries(selectedItem).map(
                ([key, value]) => (
                  <Descriptions.Item
                    key={key}
                    label={key}
                  >
                    {Array.isArray(value) ? (
                      <Space wrap>
                        {value.map((v, i) => (
                          <Tag key={i}>
                            {String(v)}
                          </Tag>
                        ))}
                      </Space>
                    ) : (
                      String(value)
                    )}
                  </Descriptions.Item>
                )
              )}
            </Descriptions>
          )}
        </Modal>

      </div>
    </ConfigProvider>
  );
};

export default TableComponent;