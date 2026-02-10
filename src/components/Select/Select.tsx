// src/components/Select/SelectComponent.tsx

import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";
import { useTheme } from "../../context/ThemeContext"; // pathni tekshiring

interface OptionType {
  label: string;
  value: string | number;
}

interface SelectComponentProps
  extends Omit<SelectProps, "options"> {
  options?: OptionType[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options = [],
  placeholder = "Tanlang",
  loading = false,
  disabled = false,
  className = "",
  ...rest
}) => {
  const { theme } = useTheme(); // 🔥 theme olish

  const popupClass =
    theme === "dark"
      ? "dark-select-dropdown"
      : "light-select-dropdown";

  return (
    <Select
      popupClassName={popupClass}
      placeholder={placeholder}
      loading={loading}
      disabled={disabled}
      className={className}
      optionFilterProp="children"
      {...rest}
    >
      {options.map((opt) => (
        <Select.Option
          key={opt.value}
          value={opt.value}
        >
          {opt.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectComponent;
