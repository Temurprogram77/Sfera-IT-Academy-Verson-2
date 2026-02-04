import { useState, useMemo, useEffect } from "react";
import { Table, Form, Popconfirm } from "antd";

import { PencilIcon, TrashBinIcon } from "../../icons";
import ModalComponent from "../Modal/Modal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { TableComponentProps } from "../../types/table";

const TableComponent = <T extends { id: number }>({
  data,
  columnsConfig,
  modalFields = [],
  searchKeys = [],
  itemName = "Item",
  pagination = { pageSize: 10 },
  onEdit,
  onDelete,
}: TableComponentProps<T>) => {
  const { t } = useTranslation();

  const [items, setItems] = useState<T[]>(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setItems(data);
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!searchKeys.length) return items;

    return items.filter((i) =>
      searchKeys.some((key) => String(i[key]).toLowerCase().includes("")),
    );
  }, [items, searchKeys]);

  const showModal = (item: T | null = null) => {
    setEditingItem(item);

    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }

    setIsModalVisible(true);
  };

  const handleEdit = (record: T) => {
    // Agar onEdit funksiyasi berilgan bo'lsa, uni chaqir va ichki modalni ochma
    if (onEdit) {
      onEdit(record);
    } else {
      // Agar onEdit yo'q bo'lsa, ichki modalni och
      showModal(record);
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...values } : i)),
      );

      toast.success(`${itemName} yangilandi`);
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...values } as T]);

      toast.success(`Yangi ${itemName} qo'shildi`);
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    onDelete?.(id);
  };

  const columns = [
    ...columnsConfig.map((col) => ({
      ...col,
      render: col.render
        ? col.render
        : (_: any, record: T) => String(record[col.key as keyof T]),
    })),

    modalFields.length > 0 && {
      title: t("actions"),
      key: "actions",
      render: (_: unknown, record: T) => (
        <div className="flex justify-end gap-3">
          <button onClick={() => handleEdit(record)}>
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      <div className="overflow-x-auto">
        <Table
          columns={columns as any}
          dataSource={filteredItems}
          rowKey="id"
          pagination={pagination}
          scroll={{ x: 900 }}
        />
      </div>

      {modalFields.length > 0 && (
        <ModalComponent
          open={isModalVisible}
          title={
            editingItem ? `${itemName} ${t("edit")}` : `${t("new")} ${itemName}`
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
    </div>
  );
};

export default TableComponent;
