export type EventColor = "QIZIL" | "YASHIL" | "SARIQ";

export interface ColorConfig {
  bg: string;
  border: string;
  text: string;
  tagColor: string;
  label: string;
  emoji: string;
  cssClass: string;
}

export const getColorConfig = (
  color: EventColor,
  isDark: boolean,
): ColorConfig => {
  switch (color) {
    case "SARIQ":
      return {
        bg: isDark ? "rgba(234,179,8,0.15)" : "rgba(234,179,8,0.08)",
        border: isDark ? "#eab308" : "#ca8a04",
        text: isDark ? "#fde047" : "#ca8a04",
        tagColor: "gold",
        label: "O'tgan",
        emoji: "",
        cssClass: "cal-yellow",
      };
    case "QIZIL":
      return {
        bg: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
        border: isDark ? "#ef4444" : "#dc2626",
        text: isDark ? "#fca5a5" : "#dc2626",
        tagColor: "red",
        label: "Bugun",
        emoji: "⚠",
        cssClass: "cal-red",
      };
    case "YASHIL":
    default:
      return {
        bg: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.08)",
        border: isDark ? "#22c55e" : "#16a34a",
        text: isDark ? "#86efac" : "#16a34a",
        tagColor: "green",
        label: "Kelgusi",
        emoji: "✓",
        cssClass: "cal-green",
      };
  }
};

// Bir kunda bir nechta rang bo'lsa — QIZIL > SARIQ > YASHIL
export const getDominantColor = (colors: EventColor[]): EventColor => {
  if (colors.includes("QIZIL")) return "QIZIL";
  if (colors.includes("SARIQ")) return "SARIQ";
  return "YASHIL";
};

// Global CSS inject — cell background va border ranglarini qo'llaydi
export const injectCalendarStyles = (isDark: boolean): void => {
  const styleId = "calendar-color-styles";
  document.getElementById(styleId)?.remove();

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    /* ── QIZIL ── */
    .cal-red > .ant-picker-cell-inner,
    .cal-red .ant-picker-cell-inner {
      background: ${isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.15)"} !important;
      border: 2px solid ${isDark ? "#ef4444" : "#dc2626"} !important;
      border-radius: 8px !important;
    }
    .cal-red .ant-picker-calendar-date-value {
      color: ${isDark ? "#fca5a5" : "#dc2626"} !important;
      font-weight: 700 !important;
    }
    /* ── SARIQ ── */
    .cal-yellow > .ant-picker-cell-inner,
    .cal-yellow .ant-picker-cell-inner {
      background: ${isDark ? "rgba(234,179,8,0.25)" : "rgba(234,179,8,0.15)"} !important;
      border: 2px solid ${isDark ? "#eab308" : "#ca8a04"} !important;
      border-radius: 8px !important;
    }
    .cal-yellow .ant-picker-calendar-date-value {
      color: ${isDark ? "#fde047" : "#ca8a04"} !important;
      font-weight: 700 !important;
    }
    /* ── YASHIL ── */
    .cal-green > .ant-picker-cell-inner,
    .cal-green .ant-picker-cell-inner {
      background: ${isDark ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.15)"} !important;
      border: 2px solid ${isDark ? "#22c55e" : "#16a34a"} !important;
      border-radius: 8px !important;
    }
    .cal-green .ant-picker-calendar-date-value {
      color: ${isDark ? "#86efac" : "#16a34a"} !important;
      font-weight: 700 !important;
    }
  `;
  document.head.appendChild(style);
};
