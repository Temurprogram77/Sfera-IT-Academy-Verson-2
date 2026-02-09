import { ReactNode } from "react";

export interface InputComponentProps {
  name?: string;
  label?: ReactNode;
  rules?: any[];
  placeholder?: string;
  prefix?: ReactNode;
  className?: string;
  value?: string | number;
  variant?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "email" | "password";
}
