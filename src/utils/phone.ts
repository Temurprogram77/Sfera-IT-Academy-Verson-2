export const formatPhoneDisplay = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length <= 3) {
    return `+${digits}`;
  }

  if (digits.length <= 5) {
    return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
  }

  if (digits.length <= 8) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5)}`;
  }

  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8)}`;
};
