import { Card, Spin } from "antd";
import { Dayjs } from "dayjs";
import { AttendanceRecord } from "../../types/type";
import { calcStudentRate } from "../../utils/attendance";
import CalendarHeader from "./CalendarHeader";
import StudentRow from "./StudentRow";

interface Props {
  students: Array<{ id: number; fulName?: string; fullName?: string }>;
  loading: boolean;
  daysInMonth: Dayjs[];
  now: Dayjs;
  month: number;
  year: number;
  groupName: string;
  attendance: AttendanceRecord[];
  loadingCell: string | null;
  pastDays: Dayjs[];
  onCellClick: (studentId: number, date: Dayjs) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const AttendanceTable = ({
  students, loading, daysInMonth, now, month, year,
  groupName, attendance, loadingCell, pastDays,
  onCellClick, onPrevMonth, onNextMonth,
}: Props) => (
  <Card styles={{ body: { padding: 0 } }} style={{ marginBottom: 16 }}>
    {loading ? (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    ) : (
      /*
       * overflowX: auto  → table gorizontal scroll
       * overflowY: auto  → table vertikal scroll (ko'p o'quvchi bo'lsa)
       * maxHeight        → sahifa emas, faqat shu box scroll bo'ladi
       */
      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520, width: "100%" }}>
        <div style={{ minWidth: "max-content" }}>
          <CalendarHeader
            month={month}
            year={year}
            groupName={groupName}
            daysInMonth={daysInMonth}
            now={now}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />
          {students.map((student, index) => (
            <StudentRow
              key={student.id}
              student={student}
              rowIndex={index}
              daysInMonth={daysInMonth}
              now={now}
              attendance={attendance}
              loadingCell={loadingCell}
              rate={calcStudentRate(attendance, student.id, pastDays)}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>
    )}
  </Card>
);

export default AttendanceTable;