import { Form, Input } from "antd";
import { InputComponentProps } from "../../types/input";

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
