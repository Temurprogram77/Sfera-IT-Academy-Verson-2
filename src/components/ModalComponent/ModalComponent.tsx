import { Modal } from "antd";
import { ReactNode } from "react";

interface ModalComponentProps {
  open: boolean;
  title: ReactNode;
  onOk?: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  children: ReactNode;
  footer?: ReactNode[] | null;
}

const ModalComponent = ({
  open,
  title,
  onOk,
  onCancel,
  okText = "Saqlash",
  cancelText = "Bekor qilish",
  children,
  footer,
}: ModalComponentProps) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      footer={footer}
      destroyOnHidden
      centered
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
