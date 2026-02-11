import { Button } from "antd";
import { IconButtonProps } from "../../types/iconButton";

const IconButton = ({
  icon,
  text,
  onClick,
  type = "primary",
  className = "",
  loading = false,
  disabled = false,
  danger = false,
  warning = false,
  htmlType = "button",
}: IconButtonProps) => {
  return (
    <Button
      type={type}
      icon={icon}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      danger={danger}
      htmlType={htmlType}
      className={`
        ${className}
        ${warning ? "warning-btn" : ""}
      `}
    >
      {text}
    </Button>
  );
};

export default IconButton;
