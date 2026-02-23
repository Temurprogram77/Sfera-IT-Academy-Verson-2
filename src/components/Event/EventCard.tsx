import React from "react";
import { Card, Tag, Popconfirm, Button } from "antd";
import {
  ClockCircleOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { IEvent } from "../../types/event";
import { EventColor, getColorConfig } from "../../utils/eventColorUtils";
import IconButton from "../IconButton/IconButton";

interface EventCardProps {
  event: IEvent;
  isDark: boolean;
  isDeleting: boolean;
  onEdit: (event: IEvent) => void;
  onDelete: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isDark,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const conf = getColorConfig(event.color as EventColor, isDark);

  return (
    <Card
      style={{
        background: isDark ? "#1f2937" : "#ffffff",
        border: `2px solid ${conf.border}`,
        borderRadius: 12,
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      styles={{ body: { padding: 20 } }} // ✅ bodyStyle deprecated — styles.body
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        {/* ── Chap tomon: ma'lumotlar ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nomi + rang badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 600,
                color: isDark ? "#f3f4f6" : "#111827",
              }}
            >
              {event.name}
            </h4>
            <Tag
              color={conf.tagColor}
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 10,
                lineHeight: "18px",
              }}
            >
              {conf.emoji} {conf.label}
            </Tag>
          </div>

          {/* Tavsif */}
          {event.description && (
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13,
                color: isDark ? "#d1d5db" : "#4b5563",
                lineHeight: 1.6,
              }}
            >
              {event.description}
            </p>
          )}

          {/* Vaqt */}
          {event.startTime && event.endTime && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <ClockCircleOutlined
                style={{ color: conf.border, fontSize: 14 }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: isDark ? "#9ca3af" : "#6b7280",
                  fontWeight: 500,
                }}
              >
                {event.startTime} – {event.endTime}
              </span>
            </div>
          )}

          {/* Guruhlar */}
          {event.groupNames && event.groupNames.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <TeamOutlined
                style={{
                  color: isDark ? "#34d399" : "#10b981",
                  fontSize: 14,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {event.groupNames.map((name, idx) => (
                  <Tag
                    key={idx}
                    color={isDark ? "purple" : "blue"}
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}
                  >
                    {name}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── O'ng tomon: tugmalar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <IconButton
            icon={<EditOutlined />}
            onClick={() => onEdit(event)}
            type="text"
            text="Tahrirlash"
          />

          {/* ✅ Popconfirm ichida oddiy Ant Design Button — IconButton emas */}
          <Popconfirm
            title="Eventni o'chirish"
            description="Bu event butunlay o'chiriladi. Davom etasizmi?"
            onConfirm={() => {
              console.log("O'chirish tasdiqlandi, id:", event.id);
              onDelete(event.id);
            }}
            okText="Ha, o'chirish"
            cancelText="Bekor qilish"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            {/* ✅ Ant Design Button — Popconfirm bilan to'g'ri ishlaydi */}
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              O'chirish
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;