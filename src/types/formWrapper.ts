import { ReactNode } from "react";

export interface FormWrapperProps {
  form: any;
  onFinish?: (values: any) => void;
  children: ReactNode;
  layout?: "vertical" | "horizontal" | "inline";
}