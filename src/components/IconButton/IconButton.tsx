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