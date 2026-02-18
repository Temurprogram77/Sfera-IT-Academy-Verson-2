import { Modal, ModalProps } from "antd";
import { ModalComponentProps } from "../../types/modal";

const ModalComponent = ({
  open,
  title,
  onOk,
  onCancel,
  okText = "Saqlash",
  cancelText = "Bekor qilish",
  children,
  footer,
  confirmLoading,
  okButtonProps,
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
      okButtonProps={okButtonProps} 
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;