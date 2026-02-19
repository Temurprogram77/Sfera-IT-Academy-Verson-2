import { Form, Input } from "antd";
import React from "react";
import { InputComponentProps } from "../../types/input";

const InputComponent = ({
  name,
  label,
  rules = [],
  placeholder,
  prefix,
  className,
  value,
  onChange,
  variant = "default",
  max,
}: InputComponentProps) => {

  // Create a helper to safely cast the shared onChange handler
  const inputHandler = onChange as React.ChangeEventHandler<HTMLInputElement>;
  const textAreaHandler = onChange as React.ChangeEventHandler<HTMLTextAreaElement>;

  const renderInput = () => {
    switch (variant) {
      case "password":
        return (
          <Input.Password
            placeholder={placeholder}
            prefix={prefix}
            className={className}
            value={value}
            onChange={inputHandler}
          />
        );

      case "textarea":
        return (
          <Input.TextArea
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={textAreaHandler}
            rows={4}
            showCount
            maxLength={max}
          />
        );

      default:
        return (
          <Input
            placeholder={placeholder}
            prefix={prefix}
            className={className}
            value={value}
            onChange={inputHandler}
          />
        );
    }
  };

  return (
    <Form.Item name={name} label={label} rules={rules} className="m-0!">
      {renderInput()}
    </Form.Item>
  );
};

export default InputComponent;
