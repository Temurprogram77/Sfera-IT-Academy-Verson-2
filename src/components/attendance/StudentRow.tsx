import React from 'react'

const StudentRow = () => {
  return (
    <div>
      
    </div>
  )
}

export default StudentRow



// import { Progress, Typography } from "antd";
// import { Dayjs } from "dayjs";
// import { AttendanceRecord } from "../../types/type";
// import { AVATAR_COLORS } from "../../constants/attendance";
// import { getAttendanceStatus, getInitials, getStudentName } from "../../utils/attendance";
// import AttendanceCell from "./Attendancecell";

// const { Text } = Typography;

// interface Props {
//   student: { id: number; fulName?: string; fullName?: string };
//   rowIndex: number;
//   daysInMonth: Dayjs[];
//   now: Dayjs;
//   attendance: AttendanceRecord[];
//   loadingCell: string | null;
//   rate: number;
//   onCellClick: (studentId: number, date: Dayjs) => void;
// }

// const rateColor = (rate: number) =>
//   rate >= 80 ? "#10b981" : rate >= 60 ? "#f59e0b" : "#ef4444";

// const StudentRow = ({
//   student, rowIndex, daysInMonth, now, attendance, loadingCell, rate, onCellClick,
// }: Props) => {
//   const name = getStudentName(student);

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: `200px repeat(${daysInMonth.length}, 36px) 90px`,
//         borderBottom: "1px solid #e5e7eb",
//         background: rowIndex % 2 === 0 ? "#fff" : "#f8fafc",
//       }}
//     >
//       {/* Name */}
//       <div
//         style={{
//           padding: "6px 10px",
//           borderRight: "1px solid #e5e7eb",
//           display: "flex",
//           alignItems: "center",
//           gap: 8,
//         }}
//       >
//         <div
//           style={{
//             width: 26, height: 26, borderRadius: "50%",
//             background: AVATAR_COLORS[rowIndex % AVATAR_COLORS.length],
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0,
//           }}
//         >
//           {getInitials(name)}
//         </div>
//         <Text style={{ fontSize: 12, fontWeight: 500 }} ellipsis>{name}</Text>
//       </div>

//       {/* Attendance cells */}
//       {daysInMonth.map((day) => {
//         const cellKey = `${student.id}-${day.format("YYYY-MM-DD")}`;
//         return (
//           <AttendanceCell
//             key={day.toString()}
//             status={getAttendanceStatus(attendance, student.id, day)}
//             isFuture={day.isAfter(now, "day")}
//             isToday={day.isSame(now, "day")}
//             isLoading={loadingCell === cellKey}
//             rowIndex={rowIndex}
//             onClick={() => onCellClick(student.id, day)}
//           />
//         );
//       })}

//       {/* Rate */}
//       <div style={{ padding: "4px 6px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
//         <Progress
//           percent={rate}
//           showInfo={false}
//           size="small"
//           strokeColor={rateColor(rate)}
//           style={{ margin: 0 }}
//         />
//         <Text style={{ fontSize: 10, fontWeight: 700, textAlign: "right", color: rateColor(rate) }}>
//           {rate}%
//         </Text>
//       </div>
//     </div>
//   );
// };

// export default StudentRow;