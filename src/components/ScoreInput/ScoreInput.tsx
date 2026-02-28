import { InputNumber, InputNumberProps } from "antd";
import React from "react";

// InputNumberProps<number> deb yozish orqali TypeScriptga 
// faqat sonlar bilan ishlashimizni bildiramiz
interface Props extends InputNumberProps<number> {
  value?: number;
  onChange?: (value: number | null) => void;
}

const ScoreInput: React.FC<Props> = ({ value, onChange, onKeyDown, ...restProps }) => {
  
  const blockKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 1. Tashqaridan kelgan onKeyDown bo'lsa, ishlatamiz
    if (onKeyDown) {
      onKeyDown(e);
    }

    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
    if (allowed.includes(e.key)) return;

    // Faqat 0-5 raqamlar
    if (!/^[0-5]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!/^[0-5]$/.test(text)) return;
    onChange?.(Number(text));
  };

  // Ant Design InputNumber value sifatida number | null qaytaradi
  const handleChange = (val: number | null) => {
    if (val === null) {
      onChange?.(null);
      return;
    }

    let finalVal = val;
    if (val < 0) finalVal = 0;
    if (val > 5) finalVal = 5;

    onChange?.(Math.floor(finalVal));
  };

  return (
    <InputNumber<number> // Bu yerda ham <number> turini aniqlashtiramiz
      {...restProps}
      value={value}
      onChange={handleChange}
      controls={false}
      precision={0}
      style={{ width: "100%", ...restProps.style }}
      onKeyDown={blockKeys}
      onPaste={handlePaste}
    />
  );
};

export default ScoreInput;