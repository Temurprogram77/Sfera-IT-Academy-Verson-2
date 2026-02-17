// components/Event/EventListView.tsx
import React from "react";
import { Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IEvent } from "../../types/event";
import IconButton from "../IconButton/IconButton";
import EventCard from "./EventCard";

interface EventListViewProps {
  selectedDate: string;
  events: IEvent[];
  loading: boolean;
  isDark: boolean;
  isDeleting: boolean;
  onAddNew: () => void;
  onEdit: (event: IEvent) => void;
  onDelete: (eventId: number) => void;
}

const EventListView: React.FC<EventListViewProps> = ({
  selectedDate,
  events,
  loading,
  isDark,
  isDeleting,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: isDark ? "#f3f4f6" : "#111827",
            }}
          >
            {selectedDate}
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
          >
            {events.length} ta event
          </p>
        </div>
        <IconButton
          icon={<PlusOutlined />}
          onClick={onAddNew}
          type="primary"
          text="Yangi event"
        />
      </div>

      {/* ── Kontent ── */}
      {loading ? (
        /* Yuklanmoqda */
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Spin size="large" />
          <p
            style={{
              marginTop: 16,
              color: isDark ? "#9ca3af" : "#6b7280",
              fontSize: 14,
            }}
          >
            Yuklanmoqda...
          </p>
        </div>
      ) : events.length === 0 ? (
        /* Bo'sh holat */
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p
            style={{
              fontSize: 15,
              color: isDark ? "#9ca3af" : "#6b7280",
              marginBottom: 24,
            }}
          >
            Bu kun uchun eventlar yo'q
          </p>
          <IconButton
            icon={<PlusOutlined />}
            onClick={onAddNew}
            type="dashed"
            text="Birinchi eventni qo'shish"
          />
        </div>
      ) : (
        /* Event kartalar ro'yxati */
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isDark={isDark}
              isDeleting={isDeleting}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListView;