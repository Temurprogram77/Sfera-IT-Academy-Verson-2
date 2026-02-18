import { ModalProps } from "antd/es/modal/interface";
import { ReactNode } from "react";

export interface ModalComponentProps {
  open: boolean;
  title: ReactNode;
  onOk?: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  children: ReactNode;
  footer?: ReactNode[] | null;
  confirmLoading?: boolean;
  okButtonProps?: ModalProps["okButtonProps"];
}