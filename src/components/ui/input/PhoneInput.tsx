import { forwardRef } from "react";

interface PhoneInputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder, disabled }, ref) => {
    return (
      <input
        ref={ref}
        type="tel"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 text-[16px] border rounded-lg focus:outline-none focus:border-[#00A67D] font-mono"
      />
    );
  }
);

export default PhoneInput;
