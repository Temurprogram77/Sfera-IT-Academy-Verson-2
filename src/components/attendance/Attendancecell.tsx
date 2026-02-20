import { Spin } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  LockOutlined,
} from "@ant-design/icons";
import { AttendanceStatus } from "../../types/type";

interface Props {
  status: AttendanceStatus | undefined;
  isFuture: boolean;
  isToday: boolean;
  isLoading: boolean;
  rowIndex: number;
  onClick: () => void;
}

const rowBg = (rowIndex: number, isToday: boolean, isFuture: boolean) => {
  if (isToday) return "#eff6ff50";
  if (isFuture) return "#f8fafc";
  return rowIndex % 2 === 0 ? "#fff" : "#f8fafc";
};

const AttendanceCell = ({
  status,
  isFuture,
  isToday,
  isLoading,
  rowIndex,
  onClick,
}: Props) => (
  <div
    onClick={() => !isFuture && onClick()}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRight: "1px solid #e5e7eb",
      height: 40,
      cursor: isFuture ? "default" : "pointer",
      background: rowBg(rowIndex, isToday, isFuture),
    }}
    onMouseEnter={(e) => {
      if (!isFuture) (e.currentTarget as HTMLDivElement).style.background = "#dbeafe";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.background = rowBg(rowIndex, isToday, isFuture);
    }}
  >
    {isLoading ? (
      <Spin size="small" />
    ) : isFuture ? (
      <LockOutlined style={{ color: "#cbd5e1", fontSize: 12 }} />
    ) : status === "KELDI" ? (
      <CheckCircleFilled style={{ color: "#10b981", fontSize: 16 }} />
    ) : status === "KELMADI" ? (
      <CloseCircleFilled style={{ color: "#ef4444", fontSize: 16 }} />
    ) : status === "SABABLI" ? (
      <ExclamationCircleFilled style={{ color: "#f59e0b", fontSize: 16 }} />
    ) : (
      <span style={{ color: "#d1d5db", fontSize: 14 }}>—</span>
    )}
  </div>
);

export default AttendanceCell;