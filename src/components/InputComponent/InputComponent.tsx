import { Form, Input } from "antd";
import { ReactNode } from "react";

interface InputComponentProps {
  name?: string;
  label?: ReactNode;
  rules?: any[];
  placeholder?: string;
  prefix?: ReactNode;
  className?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "email" | "password";
}

const InputComponent = ({
  name,
  label,
  rules = [],
  type = "text",
  placeholder,
  prefix,
  className,
  value,
  onChange,
}: InputComponentProps) => {
  return (
    <Form.Item name={name} label={label} rules={rules} className="m-0!">
      <Input
        type={type}
        placeholder={placeholder}
        prefix={prefix}
        className={className}
        value={value}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default InputComponent;
