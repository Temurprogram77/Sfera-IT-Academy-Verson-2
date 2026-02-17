// components/Event/EventCalendarCell.tsx
import React from "react";
import { IEvent } from "../../types/event";
import {
  getDominantColor,
  getColorConfig,
  EventColor,
} from "../../utils/eventColorUtils";
import EventBadge from "./EventBadge";

// Nechta badge ko'rsatiladi
const MAX_VISIBLE = 2;

interface EventCalendarCellProps {
  events: IEvent[];
  originNode: React.ReactNode;
  isDark: boolean;
}

const EventCalendarCell: React.FC<EventCalendarCellProps> = ({
  events,
  originNode,
  isDark,
}) => {
  if (events.length === 0) return <>{originNode}</>;

  const dominantColor = getDominantColor(
    events.map((e) => e.color as EventColor)
  );
  const conf = getColorConfig(dominantColor, isDark);

  const visibleEvents = events.slice(0, MAX_VISIBLE);
  const hiddenCount = events.length - MAX_VISIBLE;

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* default calendar number */}
      {originNode}

      {/* background highlight */}
      <div className={conf.cssClass} />

      {/* events list */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 2,
          right: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {visibleEvents.map((event) => (
          <EventBadge
            key={event.id}
            name={`${event.name} ${event.startTime}`}
            color={event.color as EventColor}
            isDark={isDark}
          />
        ))}

        {hiddenCount > 0 && (
          <div
            style={{
              fontSize: 10,
              textAlign: "center",
              fontWeight: 600,
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
          >
            +{hiddenCount} ta ko‘proq
          </div>
        )}
      </div>
    </div>
  );
};


export default EventCalendarCell;