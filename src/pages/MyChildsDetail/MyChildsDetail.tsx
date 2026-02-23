import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Avatar,
  Tag,
  Row,
  Col,
  Timeline,
  Progress,
  Statistic,
  Segmented,
  Spin,
  Empty,
} from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import {
  useMyChildren,
  useChildStats,
  useChildMarks,
  useChildAttendance,
} from "../../hooks/useParentChild";
import type { MarkFilter, AttendanceFilter } from "../../types/parent";

// Kunlar uzbekcha
const DAY_UZ: Record<string, string> = {
  MONDAY: "Dushanba",
  TUESDAY: "Seshanba",
  WEDNESDAY: "Chorshanba",
  THURSDAY: "Payshanba",
  FRIDAY: "Juma",
  SATURDAY: "Shanba",
  SUNDAY: "Yakshanba",
};

// Baho kategoriyasi → rang
const CATEGORY_COLOR: Record<string, string> = {
  YASHIL: "green",
  SARIQ: "gold",
  QIZIL: "red",
};

export default function MyChildsDetail() {
  const { id } = useParams<{ id: string }>();

  const [markFilter, setMarkFilter] = useState<MarkFilter>("WEEKLY");
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>("WEEKLY");

  // Bolalar ro'yxatidan shu id ga mos bolani topamiz
  const { children, loading: childrenLoading } = useMyChildren();
  const child = children.find((c) => String(c.id) === String(id));

  const { stats, loading: statsLoading } = useChildStats(id);
  const { marks, loading: marksLoading } = useChildMarks(id, markFilter);
  const { attendance, loading: attendanceLoading } = useChildAttendance(id, attendanceFilter);

  if (childrenLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="p-6">
        <Empty description="Farzand topilmadi" />
      </div>
    );
  }

  const attendancePercent =
    stats.attendancePercent !== null ? stats.attendancePercent : 0;

  return (
    <div className="p-3 md:p-6 space-y-6">

      {/* ===== BOLA HEADER ===== */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar size={72} src={child.imgUrl || undefined}>
            {!child.imgUrl && child.fulName?.[0]}
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{child.fulName}</h2>
            <p className="text-gray-500">{child.groupName}</p>
          </div>
        </div>
      </Card>

      {/* ===== STATISTIKA ===== */}
      <Row gutter={[16, 16]}>
        <Col className="mt-3" xs={24} md={8}>
          <Card loading={statsLoading}>
            <Statistic
              title="Davomat"
              value={attendancePercent ?? 0}
              suffix="%"
            />
            <Progress
              percent={attendancePercent ?? 0}
              status={
                attendancePercent === null
                  ? "exception"
                  : attendancePercent >= 80
                  ? "success"
                  : "exception"
              }
            />
          </Card>
        </Col>

        <Col className="mt-3" xs={24} md={8}>
          <Card loading={statsLoading}>
            <Statistic
              title="O'rtacha baho"
              value={stats.averageGrade?.toFixed(1) ?? "—"}
            />
          </Card>
        </Col>

        <Col className="mt-3" xs={24} md={8}>
          <Card loading={statsLoading}>
            <Statistic
              title="Fanlar soni"
              value={stats.subjectsCount ?? 0}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== DAVOMAT ===== */}
      <Card
        title="Davomat"
        extra={
          <Segmented
            size="small"
            options={[
              { label: "Haftalik", value: "WEEKLY" },
              { label: "Oylik", value: "MONTHLY" },
            ]}
            value={attendanceFilter}
            onChange={(val) => setAttendanceFilter(val as AttendanceFilter)}
          />
        }
      >
        {attendanceLoading ? (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        ) : attendance.length === 0 ? (
          <Empty description="Ma'lumot yo'q" />
        ) : (
          <div className="flex flex-wrap gap-3">
            {attendance.map((item, i) => (
              <Tag
                key={i}
                icon={
                  item.present ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                  )
                }
                color={item.present ? "success" : "error"}
                className="px-3 py-1"
              >
                {DAY_UZ[item.day] ?? item.day}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      {/* ===== BAHOLAR ===== */}
      <Card
      className="mt-3!"
        title="Baholar"
        extra={
          <Segmented
            size="small"
            options={[
              { label: "Haftalik", value: "WEEKLY" },
              { label: "Oylik", value: "MONTHLY" },
            ]}
            value={markFilter}
            onChange={(val) => setMarkFilter(val as MarkFilter)}
          />
        }
      >
        {marksLoading ? (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        ) : marks.length === 0 ? (
          <Empty description="Baho topilmadi" />
        ) : (
          <Timeline>
            {marks.map((mark, i) => (
              <Timeline.Item key={i}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {DAY_UZ[mark.day] ?? mark.day}
                    </div>
                    <div className="text-xs text-gray-500">{mark.date}</div>
                  </div>

                  <Tag
                    color={CATEGORY_COLOR[mark.category] ?? "default"}
                    className="text-lg px-3"
                  >
                    {mark.score}
                  </Tag>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
}