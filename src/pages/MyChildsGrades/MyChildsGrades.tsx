import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Tag,
  Timeline,
  Segmented,
  Spin,
  Empty,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  TrophyOutlined,
  CalendarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useChildMarks } from "../../hooks/useParentChild";
import type { MarkFilter } from "../../types/parent";

const DAY_UZ: Record<string, string> = {
  MONDAY: "Dushanba",
  TUESDAY: "Seshanba",
  WEDNESDAY: "Chorshanba",
  THURSDAY: "Payshanba",
  FRIDAY: "Juma",
  SATURDAY: "Shanba",
  SUNDAY: "Yakshanba",
};

const CATEGORY_TAG_COLOR: Record<string, string> = {
  YASHIL: "green",
  SARIQ: "gold",
  QIZIL: "red",
};

const CATEGORY_UZ: Record<string, string> = {
  YASHIL: "A'lo",
  SARIQ: "Qoniqarli",
  QIZIL: "Qoniqarsiz",
};

export default function MyChildsGrades() {
  const { id } = useParams<{ id: string }>();
  const [filter, setFilter] = useState<MarkFilter>("WEEKLY");

  const { marks, loading } = useChildMarks(id, filter);

  // Hisob-kitoblar
  const averageScore =
    marks.length > 0
      ? (marks.reduce((sum, m) => sum + m.score, 0) / marks.length).toFixed(1)
      : "—";

  const highestScore =
    marks.length > 0 ? Math.max(...marks.map((m) => m.score)) : 0;

  const categoryCount = marks.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-3 md:p-6 space-y-5">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-black dark:text-white m-0">
          Baholar
        </h2>

        <Segmented
          options={[
            { label: "Haftalik", value: "WEEKLY" },
            { label: "Oylik", value: "MONTHLY" },
          ]}
          value={filter}
          onChange={(val) => setFilter(val as MarkFilter)}
        />
      </div>

      {/* ===== UMUMIY STATISTIKA ===== */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="O'rtacha baho"
              value={averageScore}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#4361ee" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Eng yuqori baho"
              value={highestScore || "—"}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Jami yozuvlar"
              value={marks.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== KATEGORIYA TAQSIMOTI ===== */}
      {marks.length > 0 && (
        <Card title="Natijalar taqsimoti">
          <div className="flex flex-wrap gap-3">
            {Object.entries(categoryCount).map(([cat, count]) => (
              <Tag
                key={cat}
                color={CATEGORY_TAG_COLOR[cat] ?? "default"}
                className="px-4 py-1 text-sm"
              >
                {CATEGORY_UZ[cat] ?? cat}: {count} ta
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* ===== BAHOLAR RO'YXATI ===== */}
      <Card title={filter === "WEEKLY" ? "Haftalik baholar" : "Oylik baholar"}>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : marks.length === 0 ? (
          <Empty description="Bu davr uchun baho topilmadi" />
        ) : (
          <Timeline>
            {marks.map((mark, i) => (
              <Timeline.Item
                key={i}
                color={
                  mark.category === "YASHIL"
                    ? "green"
                    : mark.category === "SARIQ"
                    ? "orange"
                    : "red"
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">
                      {DAY_UZ[mark.day] ?? mark.day}
                    </div>
                    <div className="text-xs text-gray-400">{mark.date}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag color={CATEGORY_TAG_COLOR[mark.category] ?? "default"}>
                      {CATEGORY_UZ[mark.category] ?? mark.category}
                    </Tag>
                    <Tag
                      color={CATEGORY_TAG_COLOR[mark.category] ?? "default"}
                      className="text-base font-bold px-3"
                    >
                      {mark.score}
                    </Tag>
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
}