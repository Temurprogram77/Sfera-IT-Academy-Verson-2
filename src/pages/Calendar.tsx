import React, { useState } from "react";
import {
  Calendar as AntCalendar,
  Modal,
  Input,
  Select,
  ConfigProvider,
  theme,
  Card,
  Alert,
} from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useTheme } from "../context/ThemeContext";

interface Event {
  id: string;
  title: string;
  date: string;
  level: "Danger" | "Success" | "Primary" | "Warning";
}

const { Option } = Select;

const levels: Event["level"][] = ["Danger", "Success", "Primary", "Warning"];

const levelColors: Record<Event["level"], string> = {
  Danger: "#ef4444",
  Success: "#22c55e",
  Primary: "#3b82f6",
  Warning: "#f59e0b",
};

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#22c55e",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f9fafb",
    colorText: "#111827",
    colorTextSecondary: "#6b7280",
    borderRadius: 14,
  },
};

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#22c55e",
    colorBgContainer: "#020617",
    colorBgLayout: "#020617",
    colorText: "#e5e7eb",
    colorTextSecondary: "#9ca3af",
    borderRadius: 14,
  },
};


const AntdCalendarApp: React.FC = () => {
  const { isDark } = useTheme();

  // ✅ Ant Design example'dan olingan state'lar
  const [value, setValue] = useState<Dayjs>(() => dayjs());
  const [selectedValue, setSelectedValue] = useState<Dayjs>(() => dayjs());

  // Event state'lar
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLevel, setEventLevel] = useState<Event["level"]>("Primary");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // ✅ Ant Design onSelect (moslashtirilgan)
  const onSelect: CalendarProps<Dayjs>["onSelect"] = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);

    const dateStr = newValue.format("YYYY-MM-DD");
    const existing = events.find((e) => e.date === dateStr);

    if (existing) {
      setEditingEvent(existing);
      setEventTitle(existing.title);
      setEventLevel(existing.level);
    } else {
      setEditingEvent(null);
      setEventTitle("");
      setEventLevel("Primary");
    }

    setIsModalOpen(true);
  };

  // ✅ Ant Design onPanelChange
  const onPanelChange: CalendarProps<Dayjs>["onPanelChange"] = (newValue) => {
    setValue(newValue);
  };

  const handleOk = () => {
    if (!eventTitle.trim()) return;

    const dateStr = selectedValue.format("YYYY-MM-DD");

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, title: eventTitle, level: eventLevel }
            : e
        )
      );
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          title: eventTitle,
          date: dateStr,
          level: eventLevel,
        },
      ]);
    }

    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setEventTitle("");
    setEventLevel("Primary");
  };

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dayEvents = events.filter((e) => e.date === dateStr);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {dayEvents.map((event) => (
          <div
            key={event.id}
            style={{
              backgroundColor: levelColors[event.level],
              color: "#fff",
              padding: "2px 6px",
              borderRadius: 6,
              fontSize: 11,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
      <Card
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          borderRadius: 18,
        }}
      >
        <Alert
          style={{ marginBottom: 16 }}
          message={`You selected date: ${selectedValue.format("YYYY-MM-DD")}`}
          type="info"
        />

        <AntCalendar
          value={value}
          fullscreen={false}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
        title={editingEvent ? "Edit event" : "Add event"}
        okText={editingEvent ? "Update" : "Add"}
      >
        <Input
          placeholder="Event title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <Select
          value={eventLevel}
          onChange={(v) => setEventLevel(v)}
          style={{ width: "100%" }}
        >
          {levels.map((level) => (
            <Option key={level} value={level}>
              {level}
            </Option>
          ))}
        </Select>
      </Modal>
    </ConfigProvider>
  );
};

export default AntdCalendarApp;
