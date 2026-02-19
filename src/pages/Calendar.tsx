// pages/Calendar/Calendar.tsx
import { useState, useEffect } from "react";
import { Calendar as AntCalendar, Spin } from "antd";
import type { Dayjs } from "dayjs";
import { useTheme } from "../context/ThemeContext";
import ModalComponent from "../components/Modal/Modal";
import { useEvents, useEventsByDate } from "../hooks/useEvent";
import { IEvent, IEventFormValues } from "../types/event";
import { useAllGroups } from "../hooks/useGroups";
import { toast } from "sonner";

// ── Event komponentlari ──────────────────────────────────────────────────────
import EventCalendarCell from "../components/Event/EventCalendarCell";
import EventListView from "../components/Event/EventListView";
import EventFormView from "../components/Event/EventFormView";
import { injectCalendarStyles } from "../utils/eventColorUtils";

// ── Boshlang'ich form qiymatlari ─────────────────────────────────────────────
const EMPTY_FORM: IEventFormValues = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  groupIds: [],
};

// ────────────────────────────────────────────────────────────────────────────
const Calendar = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [formValues, setFormValues] = useState<IEventFormValues>(EMPTY_FORM);

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const { groups: groupsData, loading: groupsLoading } = useAllGroups();

  const {
    events: allEvents,
    loading: allEventsLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
    refetch: refetchAllEvents,
  } = useEvents();

  const {
    events: selectedDateEvents,
    loading: selectedDateLoading,
    refetch: refetchEvents,
  } = useEventsByDate(selectedDate, isModalVisible);

  // ── Global CSS inject (rang klasslari) ─────────────────────────────────────
  useEffect(() => {
    injectCalendarStyles(isDark);
    return () => {
      document.getElementById("calendar-color-styles")?.remove();
    };
  }, [isDark]);

  // ── Modal ochilganda eventlarni qayta yuklash ──────────────────────────────
  useEffect(() => {
    if (isModalVisible && selectedDate && !isFormMode) {
      refetchEvents();
    }
  }, [isModalVisible, selectedDate, isFormMode, refetchEvents]);

  // ── Form reset ─────────────────────────────────────────────────────────────
  const resetForm = (date?: string) => {
    setFormValues({ ...EMPTY_FORM, date: date ?? selectedDate ?? "" });
    setEditingEvent(null);
  };

  // ── Kalendar sanani tanlash ────────────────────────────────────────────────
  const onSelect = (date: Dayjs) => {
    const formatted = date.format("YYYY-MM-DD");
    setSelectedDate(formatted);
    setIsModalVisible(true);
    setIsFormMode(false);
    resetForm(formatted);
  };

  // ── Yangi event qo'shish ───────────────────────────────────────────────────
  const handleAddNew = () => {
    resetForm();
    setIsFormMode(true);
    setFormValues((prev) => ({ ...prev, date: selectedDate ?? "" }));
  };

  // ── Event tahrirlash ───────────────────────────────────────────────────────
  const handleEdit = (event: IEvent) => {
    setEditingEvent(event);
    setIsFormMode(true);

    // groupNames → groupIds mapping
    const selectedGroupIds: number[] = [];
    event.groupNames?.forEach((groupName) => {
      const found = groupsData?.find(
        (g: any) => g.groupName === groupName || g.name === groupName,
      );
      if (found) selectedGroupIds.push(found.id);
    });

    setFormValues({
      name: event.name,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      groupIds: selectedGroupIds,
    });
  };

  // ── Event o'chirish ────────────────────────────────────────────────────────
  const handleDelete = async (eventId: number) => {
    await deleteEvent(eventId);
    await refetchAllEvents();
  };

  // ── Modal OK (saqlash / yangilash / yopish) ────────────────────────────────
  const handleOk = async () => {
    if (!isFormMode) {
      setIsModalVisible(false);
      return;
    }

    if (!formValues.name.trim()) {
      toast.error("Event nomi kiritilishi shart!");
      return;
    }
    if (!formValues.date) {
      toast.error("Sana tanlanishi shart!");
      return;
    }

    try {
      const payload = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        date: formValues.date,
        startTime: formValues.startTime || "00:00",
        endTime: formValues.endTime || "23:59",
        groupIds: formValues.groupIds || [],
      };

      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, ...payload });
      } else {
        await createEvent(payload);
      }

      await refetchAllEvents();
      setIsFormMode(false);
      resetForm();
    } catch (err) {
      console.error("Event saqlashda xatolik:", err);
    }
  };

  // ── Modal Cancel ───────────────────────────────────────────────────────────
  const handleCancel = () => {
    if (isFormMode) {
      setIsFormMode(false);
      resetForm();
    } else {
      setIsModalVisible(false);
    }
  };

  // ── cellRender — Ant Design Calendar ──────────────────────────────────────
  const cellRender = (current: Dayjs, info: any) => {
    if (info.type !== "date") return info.originNode;

    const calendarDate = current.format("YYYY-MM-DD");
    const dayEvents = allEvents.filter((e) => e.date === calendarDate);

    return (
      <EventCalendarCell
        events={dayEvents}
        originNode={info.originNode}
        isDark={isDark}
      />
    );
  };

  // ── Modal sarlavhasi ───────────────────────────────────────────────────────
  const modalTitle = isFormMode
    ? editingEvent
      ? `Event tahrirlash — ${selectedDate}`
      : `Yangi event — ${selectedDate}`
    : `${selectedDate} — Eventlar`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: isDark ? "#111827" : "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {allEventsLoading ? (
        <div className="flex justify-center items-center py-30">
          <Spin size="large" />
        </div>
      ) : (
        <AntCalendar
          onSelect={onSelect}
          cellRender={cellRender}
          style={{
            background: isDark ? "#1f2937" : "#ffffff",
            borderRadius: 12,
            padding: 16,
            boxShadow: isDark
              ? "0 4px 6px rgba(0,0,0,0.3)"
              : "0 4px 6px rgba(0,0,0,0.1)",
          }}
        />
      )}

      {/* ── Modal ── */}
      <ModalComponent
        title={modalTitle}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={
          isFormMode ? (editingEvent ? "Yangilash" : "Saqlash") : "Yopish"
        }
        cancelText={isFormMode ? "Bekor qilish" : undefined}
        confirmLoading={isCreating || isUpdating}
        // width={800}
      >
        {isFormMode ? (
          <EventFormView
            formValues={formValues}
            onChange={setFormValues}
            groups={groupsData}
            groupsLoading={groupsLoading}
          />
        ) : (
          <EventListView
            selectedDate={selectedDate ?? ""}
            events={selectedDateEvents}
            loading={selectedDateLoading}
            isDark={isDark}
            isDeleting={isDeleting}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default Calendar;
