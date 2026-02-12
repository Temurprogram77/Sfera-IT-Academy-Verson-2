import { Form } from "antd";

export type ColumnConfig<T> = {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T) => React.ReactNode;
};

export type ModalField<T> = {
  name: keyof T | string;
  label: string;
  component: React.ReactNode;
  rules?: Parameters<typeof Form.Item>[0]["rules"];
};

export interface TableComponentProps<T extends { id: number }> {
  data: T[];
  columnsConfig: ColumnConfig<T>[];
  modalFields?: ModalField<T>[];
  searchKeys?: (keyof T)[];
  itemName?: string;
  pagination?:
    | false
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
        showSizeChanger?: boolean;
        showTotal?: (total: number) => string;
        pageSizeOptions?: string[];
      };
  onEdit?: (record: T) => void;
  onDelete?: (id: number) => void;
  viewPath?: (id: number) => string;
}
