import React, { useState } from "react";
import { Calendar as AntCalendar, Modal, Input, Button } from "antd";
// import dayjs from "dayjs";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null); // Bosilgan sana
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notes, setNotes] = useState({});
  const [inputValue, setInputValue] = useState("");

  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setInputValue(notes[formattedDate] || "");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setNotes({
      ...notes,
      [selectedDate]: inputValue, // Sana bo‘yicha saqlash
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <AntCalendar onSelect={onSelect} />

      <Modal
        title={`Qaydlar: ${selectedDate}`}
        visible={isModalVisible}
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
        />
      </Modal>

      <div style={{ marginTop: 20 }}>
        <h3>Saqlangan yozuvlar:</h3>
        {Object.keys(notes).length === 0 && <p>Hozircha yozuvlar yo‘q.</p>}
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
