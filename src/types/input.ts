import { ReactNode } from "react";

export interface InputComponentProps {
  name?: string;
  label?: React.ReactNode;
  rules?: any[];
  placeholder?: string;
  prefix?: React.ReactNode;
  className?: string;
  value?: string | number;
  max?: number;
  variant?: "default" | "password" | "textarea";
  onChange?:
    | ((e: React.ChangeEvent<HTMLInputElement>) => void)
    | ((e: React.ChangeEvent<HTMLTextAreaElement>) => void);
  type?: "text" | "number" | "email" | "password";
}
