import { Modal, ConfigProvider } from "antd";
import { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

interface ModalComponentProps {
  open: boolean;
  title: ReactNode;
  onOk?: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  children: ReactNode;
  footer?: ReactNode[] | null;
  confirmLoading?: boolean;
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
  confirmLoading,
}: ModalComponentProps) => {
  const { theme } = useTheme();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff", // Primary rang (OK button)
          colorBgMask: "rgba(0, 0, 0, 0.45)", // Modal orqa fon
          borderRadiusLG: 8, // Border radius
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
      <Modal
        open={open}
        title={title}
        onOk={onOk}
        onCancel={onCancel}
        okText={okText}
        cancelText={cancelText}
        footer={footer}
        confirmLoading={confirmLoading}
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
};

export default ModalComponent;
