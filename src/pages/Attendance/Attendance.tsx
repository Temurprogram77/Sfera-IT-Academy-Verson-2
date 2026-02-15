import React, { useEffect, useState } from "react";
import { createSSE } from "../../services/sseService";

interface Attendance {
  id: number;
  fullName: string;
  studentId: number;
  status: string;
  description: string | null;
  date: string;
}

const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    const sse = createSSE({
      url: "http://5.189.158.5:8082/attendance/stream/12",
      eventName: "attendance",
      onMessage: (data: Attendance[]) => {
        console.log("DATA:", data);
        setAttendance(data);
      },
    });
    console.log(attendance);

    return () => {
      sse.close();
    };
  }, []);

  return (
    <div>
      <h2>Attendance List</h2>
      {attendance.map((item) => (
        <div key={item.id}>
          <p>{item.fullName}</p>
          <p>{item.status}</p>
          <p>{item.date}</p>
        </div>
      ))}
    </div>
  );
};

export default AttendancePage;
