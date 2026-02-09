import React from "react";
import { Form } from "antd";
import { FormWrapperProps } from "../../types/formWrapper";

// Typing
type FormWrapperType = React.FC<FormWrapperProps> & {
  Item: typeof Form.Item;
  useForm: typeof Form.useForm;
};

const FormWrapper: FormWrapperType = ({
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

// Static properties
FormWrapper.Item = Form.Item;
FormWrapper.useForm = Form.useForm;

export default FormWrapper;
