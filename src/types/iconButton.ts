import { ReactNode } from "react";

export interface IconButtonProps {
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
  type?: "default" | "primary" | "dashed" | "link" | "text";
  // variant?: "default" | "danger" | "warning" | "success";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  warning?: boolean;
  htmlType?: "button" | "submit" | "reset";
}
