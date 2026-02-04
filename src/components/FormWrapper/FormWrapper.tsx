import React from "react";
import { Form } from "antd";

interface FormWrapperProps {
  form: any;
  onFinish?: (values: any) => void;
  children: React.ReactNode;
  layout?: "vertical" | "horizontal" | "inline";
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  form,
  onFinish,
  children,
  layout = "vertical",
}) => {
  return (
    <Form form={form} layout={layout} onFinish={onFinish}>
      {children}
    </Form>
  );
};

export default FormWrapper;
