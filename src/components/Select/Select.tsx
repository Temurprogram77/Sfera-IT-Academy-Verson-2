import React from "react";
import { Select} from "antd";

interface SelectComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  style?: React.CSSProperties;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  value,
  onChange,
  options = [
    { label: "Faol", value: "Faol" },
    { label: "Ta'tilda", value: "Ta'tilda" },
  ],
  placeholder = "Holatni tanlang",
  style = { width: "100%" },
}) => {

  return (
    <Select
      popupClassName="dark-select-dropdown"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
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
