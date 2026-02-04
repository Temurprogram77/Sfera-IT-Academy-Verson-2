import { ReactNode } from "react";

export interface IconButtonProps {
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
