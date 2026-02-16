import { useState, useEffect } from "react";
import { Calendar as AntCalendar, Spin, Tag, Card, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import { useTheme } from "../context/ThemeContext";
import ModalComponent from "../components/Modal/Modal";
import InputComponent from "../components/Input/Input";
import SelectComponent from "../components/Select/Select";
import IconButton from "../components/IconButton/IconButton";
import FormWrapper from "../components/FormWrapper/FormWrapper";
import { useEvents, useEventsByDate } from "../hooks/useEvent";
import { IEvent, IEventFormValues } from "../types/event";
import { useAllGroups } from "../hooks/useGroups";
import { toast } from "sonner";

const Calendar = () => {
  const { theme } = useTheme();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [isFormMode, setIsFormMode] = useState(false);
  const [formValues, setFormValues] = useState<IEventFormValues>({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    groupIds: [],
  });

  // Hooks
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
  } = useEvents();

  const {
    events: selectedDateEvents,
    loading: selectedDateLoading,
    refetch: refetchEvents,
  } = useEventsByDate(selectedDate, isModalVisible);

  // Modal ochilganda eventlarni refetch qilish
  useEffect(() => {
    if (isModalVisible && selectedDate && !isFormMode) {
      refetchEvents();
    }
  }, [isModalVisible, selectedDate, isFormMode, refetchEvents]);

  // Kalendar sanani tanlash
  const onSelect = (date: Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setIsModalVisible(true);
    setIsFormMode(false);
    resetForm();
  };

  // Formani tozalash
  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
      date: selectedDate || "",
      startTime: "",
      endTime: "",
      groupIds: [],
    });
    setEditingEvent(null);
  };

  // Event tahrirlash
  const handleEdit = (event: IEvent) => {
    setEditingEvent(event);
    setIsFormMode(true);

    const selectedGroupIds: number[] = [];
    if (event.groupNames && event.groupNames.length > 0) {
      event.groupNames.forEach((groupName) => {
        const foundGroup = groupsData?.find(
          (g: any) => g.groupName === groupName || g.name === groupName
        );
        if (foundGroup) {
          selectedGroupIds.push(foundGroup.id);
        }
      });
    }

    setFormValues({
      name: event.name,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      groupIds: selectedGroupIds,
    });
  };

  // Yangi event qo'shish
  const handleAddNew = () => {
    resetForm();
    setIsFormMode(true);
    setFormValues((prev) => ({ ...prev, date: selectedDate || "" }));
  };

  // Event o'chirish
  const handleDelete = (eventId: number) => {
    deleteEvent(eventId);
  };

  // Saqlash
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
      const eventData = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        date: formValues.date,
        startTime: formValues.startTime || "00:00",
        endTime: formValues.endTime || "23:59",
        groupIds: formValues.groupIds || [],
      };

      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, ...eventData });
      } else {
        await createEvent(eventData);
      }

      setIsFormMode(false);
      resetForm();
    } catch (error) {
      console.error("Event saqlashda xatolik:", error);
    }
  };

  const handleCancel = () => {
    if (isFormMode) {
      setIsFormMode(false);
      resetForm();
    } else {
      setIsModalVisible(false);
    }
  };

  // Kalendarda eventlarni ko'rsatish
  const dateCellRender = (date: Dayjs) => {
    const calendarDate = date.format("YYYY-MM-DD");
    const dayEvents = allEvents.filter((event) => event.date === calendarDate);

    if (dayEvents.length === 0) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: 4,
          padding: "0 2px",
        }}
      >
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "3px 6px",
              borderRadius: "4px",
              fontSize: "11px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 500,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            {event.name}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div
            style={{
              fontSize: "10px",
              color: theme === "dark" ? "#9ca3af" : "#6b7280",
              textAlign: "center",
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            +{dayEvents.length - 2} ta event
          </div>
        )}
      </div>
    );
  };

  // Modal title
  const getModalTitle = () => {
    if (isFormMode) {
      return editingEvent
        ? `Event tahrirlash: ${selectedDate}`
        : `Yangi event qo'shish: ${selectedDate}`;
    }
    return `${selectedDate} - Eventlar`;
  };

  return (
    <div
      className="p-6 rounded-lg"
      style={{
        background: theme === "dark" ? "#111827" : "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: theme === "dark" ? "#f3f4f6" : "#111827",
            margin: 0,
          }}
        >
          📅 Eventlar Kalendari
        </h1>
        {allEventsLoading && <Spin />}
      </div>

      {/* Calendar */}
      <AntCalendar
        onSelect={onSelect}
        cellRender={dateCellRender}
        style={{
          background: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#e5e7eb" : "#111827",
          borderRadius: "12px",
          padding: "16px",
          boxShadow:
            theme === "dark"
              ? "0 4px 6px rgba(0, 0, 0, 0.3)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Modal */}
      <ModalComponent
        title={getModalTitle()}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isFormMode ? (editingEvent ? "Yangilash" : "Saqlash") : "Yopish"}
        cancelText={isFormMode ? "Bekor qilish" : null}
        width={800}
        okButtonProps={{ loading: isCreating || isUpdating }}
      >
        {!isFormMode ? (
          // Event ro'yxati
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 16,
                borderBottom: `2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: theme === "dark" ? "#f3f4f6" : "#111827",
                  }}
                >
                  {selectedDate}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "14px",
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                  }}
                >
                  {selectedDateEvents.length} ta event
                </p>
              </div>
              <IconButton
                icon={<PlusOutlined />}
                onClick={handleAddNew}
                type="primary"
                size="large"
              >
                Yangi event
              </IconButton>
            </div>

            {/* Events List */}
            {selectedDateLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16, color: theme === "dark" ? "#9ca3af" : "#6b7280" }}>
                  Eventlar yuklanmoqda...
                </p>
              </div>
            ) : selectedDateEvents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: 16 }}>📭</div>
                <p
                  style={{
                    fontSize: "16px",
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    marginBottom: 24,
                  }}
                >
                  Bu kun uchun eventlar yo'q
                </p>
                <IconButton
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                  type="dashed"
                  size="large"
                >
                  Birinchi eventni qo'shish
                </IconButton>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {selectedDateEvents.map((event) => (
                  <Card
                    key={event.id}
                    style={{
                      background: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "12px",
                      boxShadow:
                        theme === "dark"
                          ? "0 2px 4px rgba(0,0,0,0.2)"
                          : "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    bodyStyle={{ padding: "20px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "18px",
                            fontWeight: 600,
                            color: theme === "dark" ? "#f3f4f6" : "#111827",
                          }}
                        >
                          {event.name}
                        </h4>

                        {event.description && (
                          <p
                            style={{
                              margin: "0 0 16px 0",
                              fontSize: "14px",
                              color: theme === "dark" ? "#d1d5db" : "#4b5563",
                              lineHeight: 1.6,
                            }}
                          >
                            {event.description}
                          </p>
                        )}

                        {event.startTime && event.endTime && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <ClockCircleOutlined
                              style={{
                                color: theme === "dark" ? "#60a5fa" : "#3b82f6",
                                fontSize: "16px",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: theme === "dark" ? "#9ca3af" : "#6b7280",
                                fontWeight: 500,
                              }}
                            >
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        )}

                        {event.groupNames && event.groupNames.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <TeamOutlined
                              style={{
                                color: theme === "dark" ? "#34d399" : "#10b981",
                                fontSize: "16px",
                              }}
                            />
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {event.groupNames.map((groupName, index) => (
                                <Tag
                                  key={index}
                                  color={theme === "dark" ? "purple" : "blue"}
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    padding: "4px 12px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  {groupName}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                        <IconButton
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(event)}
                          type="text"
                        >
                          Tahrirlash
                        </IconButton>
                        <Popconfirm
                          title="Eventni o'chirish"
                          description="Bu event butunlay o'chiriladi. Davom etasizmi?"
                          onConfirm={() => handleDelete(event.id)}
                          okText="Ha, o'chirish"
                          cancelText="Bekor qilish"
                          okButtonProps={{ danger: true }}
                        >
                          <IconButton
                            icon={<DeleteOutlined />}
                            danger
                            loading={isDeleting}
                          >
                            O'chirish
                          </IconButton>
                        </Popconfirm>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Form - FormWrapper bilan
          <FormWrapper>
            <InputComponent
              label="Event nomi"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              placeholder="Masalan: Bayram"
              required
            />

            <InputComponent
              label="Tavsif"
              value={formValues.description}
              onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
              placeholder="Event haqida batafsil ma'lumot..."
              type="textarea"
              rows={4}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <InputComponent
                label="Boshlanish vaqti"
                value={formValues.startTime}
                onChange={(e) => setFormValues({ ...formValues, startTime: e.target.value })}
                type="time"
                placeholder="00:00"
              />

              <InputComponent
                label="Tugash vaqti"
                value={formValues.endTime}
                onChange={(e) => setFormValues({ ...formValues, endTime: e.target.value })}
                type="time"
                placeholder="23:59"
              />
            </div>

            <SelectComponent
              label="Guruhlar"
              value={formValues.groupIds}
              onChange={(value) => setFormValues({ ...formValues, groupIds: value })}
              options={groupsData?.map((group: any) => ({
                value: group.id,
                label: group.groupName || group.name || `Guruh ${group.id}`,
              }))}
              placeholder="Guruhlarni tanlang"
              mode="multiple"
              loading={groupsLoading}
              helperText="Bir nechta guruhni tanlashingiz mumkin"
            />
          </FormWrapper>
        )}
      </ModalComponent>
    </div>
  );
};

export default Calendar;