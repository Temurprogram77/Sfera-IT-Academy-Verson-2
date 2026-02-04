import React from "react";
import { Form } from "antd";
import { FormWrapperProps } from "../../types/formWrapper";

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
