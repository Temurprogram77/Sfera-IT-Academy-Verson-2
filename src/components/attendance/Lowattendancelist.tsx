import { Card, Space, Progress, Tag, Typography } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { AVATAR_COLORS } from "../../constants/attendance";
import { getInitials, getStudentName } from "../../utils/attendance";

const { Text } = Typography;

interface LowStudent {
  id: number;
  fulName?: string;
  fullName?: string;
  rate: number;
}

interface Props {
  students: LowStudent[];
}

const LowAttendanceList = ({ students }: Props) => {
  if (students.length === 0) return null;

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      title={
        <Space>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          <Text style={{ fontSize: 13, fontWeight: 600 }}>O'quvchilarning oylik davomati</Text>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }} size={8}>
        {students.map((s, i) => {
          const name = getStudentName(s);
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}
              >
                {getInitials(name)}
              </div>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>{name}</Text>
                <Progress percent={s.rate} showInfo={false} size="small" strokeColor="#ef4444" style={{ margin: 0 }} />
              </div>
              <Tag color="error" icon={<WarningOutlined />} style={{ fontSize: 10, marginRight: 0 }}>
                {s.rate}% Diqqat!
              </Tag>
            </div>
          );
        })}
      </Space>
    </Card>
  );
};

export default LowAttendanceList;