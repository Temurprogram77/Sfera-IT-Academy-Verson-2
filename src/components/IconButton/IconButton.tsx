import { Button } from "antd";
import { ReactNode } from "react";

interface IconButtonProps {
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
  type?: "default" | "primary" | "dashed" | "link" | "text";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  htmlType?: "button" | "submit" | "reset";
}

const IconButton = ({
  icon,
  text,
  onClick,
  type = "primary",
  className = "",
  loading = false,
  disabled = false,
  danger = false,
  htmlType = "button",
}: IconButtonProps) => {
  return (
    <Button
      type={type}
      icon={icon}
      onClick={onClick}
      className={className}
      loading={loading}
      disabled={disabled}
      danger={danger}
      htmlType={htmlType}
    >
      {text}
    </Button>
  );
};

export default IconButton;