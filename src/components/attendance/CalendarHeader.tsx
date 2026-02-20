import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { MONTHS_UZ, DAYS_UZ } from "../../constants/attendance";

interface Props {
  month: number;
  year: number;
  groupName: string;
  daysInMonth: Dayjs[];
  now: Dayjs;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader = ({
  month, year, groupName, daysInMonth, now, onPrevMonth, onNextMonth,
}: Props) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `200px repeat(${daysInMonth.length}, 36px) 90px`,
      borderBottom: "1px solid #e5e7eb",
      background: "#f9fafb",
    }}
  >
    {/* Nav cell */}
    <div
      style={{
        padding: "8px 6px",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Button type="text" icon={<LeftOutlined />} onClick={onPrevMonth} size="small" />
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 12 }}>
          {MONTHS_UZ[month]} {year}
        </div>
        <div style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {groupName}
        </div>
      </div>
      <Button type="text" icon={<RightOutlined />} onClick={onNextMonth} size="small" />
    </div>

    {/* Day columns */}
    {daysInMonth.map((day) => {
      const isFuture = day.isAfter(now, "day");
      const isToday = day.isSame(now, "day");
      return (
        <div
          key={day.toString()}
          style={{
            textAlign: "center",
            borderRight: "1px solid #e5e7eb",
            padding: "4px 2px",
            background: isToday ? "#eff6ff" : isFuture ? "#f8fafc" : undefined,
          }}
        >
          <div style={{ fontSize: 9, color: "#94a3b8" }}>{DAYS_UZ[day.day()]}</div>
          <div
            style={{
              width: 22, height: 22, borderRadius: "50%", margin: "2px auto 0",
              background: isToday ? "#2563eb" : "transparent",
              color: isToday ? "#fff" : isFuture ? "#cbd5e1" : "#475569",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
            }}
          >
            {day.format("DD")}
          </div>
        </div>
      );
    })}

    <div style={{ padding: "8px 4px", fontWeight: 600, fontSize: 12, textAlign: "center" }}>
      Natija
    </div>
  </div>
);

export default CalendarHeader;