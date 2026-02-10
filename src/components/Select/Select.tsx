// src/components/Select/SelectComponent.tsx
import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";

interface SelectComponentProps extends Omit<SelectProps, "options"> {
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  popupClassName?: string;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options = [],
  placeholder = "Tanlang",
  loading = false,
  disabled = false,
  className = "",
  popupClassName = "dark-select-dropdown",
  ...rest
}) => {
  return (
    <Select
      popupClassName={popupClassName}
      placeholder={placeholder}
      loading={loading}
      disabled={disabled}
      className={className}
      optionFilterProp="children"
      {...rest}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value}>
          {opt.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectComponent;
