import { Input } from "antd";
import type { InputProps } from "antd";
import clsx from "clsx";

interface BaseInputProps extends InputProps {
  label?: string;
  error?: string;
}

const BaseInput = ({
  label,
  error,
  className,
  ...props
}: BaseInputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Input
        {...props}
        className={clsx(
          "rounded-lg",
          error && "border-red-500 focus:border-red-500",
          className
        )}
      />

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default BaseInput;
