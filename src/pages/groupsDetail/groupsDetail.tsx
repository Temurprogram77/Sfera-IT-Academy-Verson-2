// src/pages/groups/GroupsDetail.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spin,
  Card,
  Tag,
  Button,
  Descriptions,
  Avatar,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Space,
  Typography,
  Tooltip,
  Divider,
} from "antd";
import {
  // TeamOutlined,
  UserOutlined,
  // BookOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  // HomeOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import NotFoundData from "../OtherPage/NotFoundData";
import { useGroupDetails } from "../../hooks/useGroups";
import { useStudents } from "../../hooks/useStudent"; // Student hook import

const { Title, Text } = Typography;

const PRIMARY_COLOR = "#00A67D";
const BUSY_COLOR = "#000000";
const FREE_COLOR = "#67E0A3";
const WARNING_COLOR = "#FF4D4F";

const GroupsDetail = () => {
  // const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { group, loading: groupLoading, error: groupError } = useGroupDetails(id || "");

  // O'quvchilarni guruh ID bo'yicha olish (params orqali filter)
  const { students, loading: studentsLoading, error: studentsError } = useStudents({
    groupId: Number(id), // Backend qo'llab-quvvatlashi kerak
  });

  useEffect(() => {
    if (groupError || studentsError) {
      console.error("Xato yuz berdi:", groupError || studentsError);
    }
  }, [groupError, studentsError]);

  if (groupLoading || studentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spin size="large" />
        <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
      </div>
    );
  }

  if (groupError || studentsError || !group) {
    return <NotFoundData title="Guruh topilmadi" description="Ma'lumot yuklanmadi yoki xato yuz berdi." />;
  }

  // Default statistika (API bog'lanmagan)
  const weeklyStats = {
    totalBusyHours: 17.0,
    totalFreeHours: 67.0,
    busiestDay: "THU",
    busiestDayHours: 5.0,
    classSessionsPerWeek: 7,
    activeCourses: 3,
    totalSchedules: 3,
  };

  // Mock kunlar bo'yicha bar chart data
  const barData = [
    { day: "MON", busy: 12, free: 0 },
    { day: "TUE", busy: 3, free: 0 },
    { day: "WED", busy: 9, free: 0 },
    { day: "THU", busy: 12, free: 0 },
    { day: "FRI", busy: 6, free: 0 },
    { day: "SAT", busy: 3, free: 0 },
    { day: "SUN", busy: 12, free: 0 },
  ];

  // Mock class distribution
  const classDistribution = [
    { name: "Frontend 16", days: 3 },
    { name: "Bootcamp 1", days: 3 },
    { name: "Bootcamp 1", days: 1 },
  ];

  const getDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      MONDAY: "Dushanba",
      TUESDAY: "Seshanba",
      WEDNESDAY: "Chorshanba",
      THURSDAY: "Payshanba",
      FRIDAY: "Juma",
      SATURDAY: "Shanba",
      SUNDAY: "Yakshanba",
    };
    return labels[day] || day;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-6">
          <Col>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              type="text"
              className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
            >
              Orqaga
            </Button>
          </Col>
          <Col>
            <Space>
              <Title level={3} className="m-0">
                {group.name}
              </Title>
              <Tooltip title="Tahrirlash">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  onClick={() => navigate(`/groups/${id}/edit`)} // Edit yo'naltirish
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>

        {/* Schedules (O'quvchilar) va Overview */}
        <Row gutter={[24, 24]}>
          {/* Left: O'quvchilar ro'yxati */}
          <Col xs={24} md={16}>
            <Card
              title="O'quvchilar"
              extra={<Tag color={PRIMARY_COLOR}>{students.length} ta</Tag>}
              className="rounded-lg shadow-md"
            >
              <List
                dataSource={students}
                renderItem={(student: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: PRIMARY_COLOR }} />}
                      title={student.name || "O'quvchi"}
                      description={`Telefon: ${student.phone || "—"} | Holati: ${student.status || "Faol"}`}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: "Hozircha o'quvchilar yo'q" }}
              />
            </Card>
          </Col>

          {/* Right: Overview */}
          <Col xs={24} md={8}>
            <Card title="Umumiy ko'rinish" className="rounded-lg shadow-md mb-6">
              <Statistic title="Jami jadval" value={weeklyStats.totalSchedules} suffix="" />
              <Divider />
              <Statistic title="Faol kurslar" value={weeklyStats.activeCourses} suffix="" />
              <Divider />
              <Statistic title="Haftalik darslar" value={weeklyStats.classSessionsPerWeek} suffix="" />
              <Divider />
              <Statistic
                title="Eng band kun"
                value={weeklyStats.busiestDay}
                suffix={`${weeklyStats.busiestDayHours} soat`}
                valueStyle={{ color: WARNING_COLOR }}
              />
              <Divider />
              <Statistic title="Haftalik jami soat" value={weeklyStats.totalWeeklyHours} suffix="" />
            </Card>

            {/* O'qituvchi va kunlar/soatlar */}
            <Card className="rounded-lg shadow-md">
              <Descriptions column={1} size="small">
                <Descriptions.Item label={<UserOutlined style={{ color: PRIMARY_COLOR }} />}>
                  O'qituvchi: {group.teacherName}
                </Descriptions.Item>
                <Descriptions.Item label={<ClockCircleOutlined style={{ color: PRIMARY_COLOR }} />}>
                  Vaqt: {group.startTime} - {group.endTime}
                </Descriptions.Item>
                <Descriptions.Item label={<CalendarOutlined style={{ color: PRIMARY_COLOR }} />}>
                  <Space wrap>
                    {group.weekDays.map((day) => (
                      <Tag key={day} color={PRIMARY_COLOR}>
                        {getDayLabel(day)}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* Past: Weekly Statistics va Class Distribution */}
        <Row gutter={[24, 24]} className="mt-8">
          {/* Weekly Statistics */}
          <Col xs={24} md={16}>
            <Card title="Haftalik statistika" className="rounded-lg shadow-md">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Jami band soat" value={weeklyStats.totalBusyHours} valueStyle={{ color: BUSY_COLOR }} />
                </Col>
                <Col span={8}>
                  <Statistic title="Jami bo'sh soat" value={weeklyStats.totalFreeHours} valueStyle={{ color: FREE_COLOR }} />
                </Col>
              </Row>
              <Divider />
              {/* Bar chart simulyatsiyasi (Ant Design Progress bilan) */}
              <Row gutter={8} align="middle">
                {barData.map((item) => (
                  <Col span={3} key={item.day} className="text-center">
                    <Tooltip title={`Band: ${item.busy} soat, Bo'sh: ${item.free} soat`}>
                      <Progress
                        type="dashboard"
                        percent={(item.busy / 12) * 100} // Maks 12 soat faraz
                        format={() => ""}
                        strokeColor={BUSY_COLOR}
                        trailColor={FREE_COLOR}
                        gapDegree={0}
                        size={50}
                      />
                    </Tooltip>
                    <Text className="block mt-2 text-sm">{item.day}</Text>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* Class Distribution */}
          <Col xs={24} md={8}>
            <Card title="Guruh taqsimoti" className="rounded-lg shadow-md">
              {classDistribution.map((item, index) => (
                <div key={index} className="mb-4">
                  <Text className="block font-medium">{item.name}</Text>
                  <Progress
                    percent={(item.days / 3) * 100} // Maks 3 kun faraz
                    format={() => `${item.days} kun`}
                    status="active"
                    strokeColor={{ '0%': PRIMARY_COLOR, '100%': SECONDARY_COLOR }}
                  />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GroupsDetail;