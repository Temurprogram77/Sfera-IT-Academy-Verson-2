import { Form, Input } from "antd";
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
  const renderInput = () => {
    switch (variant) {
      case "password":
        return (
          <Input.Password
            placeholder={placeholder}
            prefix={prefix}
            className={className}
            value={value}
            onChange={onChange}
          />
        );

      case "textarea":
        return (
          <Input.TextArea
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={onChange}
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
            onChange={onChange}
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
