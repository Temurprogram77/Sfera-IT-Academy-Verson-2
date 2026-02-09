import React from "react";
import { Input } from "antd";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

// UI uchun ko'rinish: +998 90 909 90 90
const formatDisplay = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.length <= 3) return `+${digits}`; // +998
  if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`; // +998 90
  if (digits.length <= 8)
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`; // +998 90 909
  if (digits.length <= 10)
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`; // +998 90 909 90
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`; // +998 90 909 90 90
};

// Backend / form uchun raw value: 998XXXXXXXXX
const formatRaw = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits.startsWith("998")) return "998" + digits.slice(0, 9);
  return digits.slice(0, 12);
};

const PhoneInput: React.FC<Props> = ({ value = "", onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = formatRaw(e.target.value);
    onChange?.(raw);
  };

  return (
    <Input
      value={formatDisplay(value)}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={17} // +998 XX XXX XX XX
    />
  );
};

export default PhoneInput;
