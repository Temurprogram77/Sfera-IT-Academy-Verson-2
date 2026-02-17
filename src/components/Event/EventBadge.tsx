// components/Event/EventBadge.tsx
import React from "react";
import { EventColor, getColorConfig } from "../../utils/eventColorUtils";

interface EventBadgeProps {
  name: string;
  color: EventColor;
  isDark: boolean;
}

const EventBadge: React.FC<EventBadgeProps> = ({ name, color, isDark }) => {
  const conf = getColorConfig(color, isDark);

  return (
    <div
      style={{
        background: conf.bg,
        border: `1px solid ${conf.border}`,
        color: conf.text,
        padding: "2px 5px",
        borderRadius: 4,
        fontSize: 10,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontWeight: 600,
        lineHeight: "16px",
      }}
    >
      {name}
    </div>
  );
};

export default EventBadge;