import { useState } from "react";
import { Calendar as AntCalendar, Input } from "antd";
import { useTheme } from "../context/ThemeContext"; // sizning theme context
import ModalComponent from "../components/Modal/Modal";

const Calendar = () => {
  const { theme } = useTheme();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");

  const onSelect = (date: any) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setInputValue(notes[formattedDate] || "");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedDate) {
      setNotes({
        ...notes,
        [selectedDate]: inputValue,
      });
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: theme === "dark" ? "#111827" : "#f9fafb" }}
    >
      <AntCalendar onSelect={onSelect} />

      <ModalComponent
        title={`Qaydlar: ${selectedDate}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Input.TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nimadir yozing..."
          rows={4}
          style={{
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#e5e7eb" : "#111827",
            borderColor: theme === "dark" ? "#374151" : "#d1d5db",
          }}
        />
      </ModalComponent>

      <div
        style={{
          marginTop: 20,
          color: theme === "dark" ? "#e5e7eb" : "#111827",
        }}
      >
        <h3>Saqlangan yozuvlar:</h3>
        {Object.keys(notes).length === 0 && <p>Hozircha yozuvlar yo'q.</p>}
        {Object.entries(notes).map(([date, note]) => (
          <p key={date}>
            <b>{date}:</b> {note}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
