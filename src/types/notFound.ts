import { ReactNode } from "react";

export interface NotFoundProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
  buttonType?: "primary" | "default" | "dashed" | "link" | "text";
  image?: string | ReactNode;
  className?: string;
  buttonLoading?: boolean;
}