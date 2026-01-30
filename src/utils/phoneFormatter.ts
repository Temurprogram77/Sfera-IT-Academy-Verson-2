export const formatPhone = (phone?: string): string => {
  if (!phone) return "";

  // Faqat raqamlarni qoldiramiz
  const cleaned = phone.replace(/\D/g, "");

  // 998901234567 => +998 90 123 45 67
  if (cleaned.length === 12 && cleaned.startsWith("998")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(
      5,
      8
    )} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }

  return phone;
};
