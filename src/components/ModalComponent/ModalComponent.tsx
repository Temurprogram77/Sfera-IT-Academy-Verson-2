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
  confirmLoading?: boolean;  // ✅ Buni qo'shing
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
  confirmLoading,  // ✅ Destructure qiling
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
      confirmLoading={confirmLoading}  
      destroyOnHidden
      centered
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;