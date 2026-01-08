import { Input } from "antd";
import type { InputProps } from "antd";

interface PasswordInputProps extends InputProps {
  label?: string;
  error?: string;
}

const PasswordInput = ({ label, error, ...props }: PasswordInputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Input.Password
        {...props}
        className={error ? "border-red-500" : ""}
        size="large"
      />

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default PasswordInput;
