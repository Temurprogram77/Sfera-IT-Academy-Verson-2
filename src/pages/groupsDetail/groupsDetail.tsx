// src/pages/groups/GroupsDetail.tsx
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Card,
  Tag,
  Button,
  Descriptions,
  Avatar,
  Row,
  Col,
  List,
  Typography,
  Divider,
  Empty,
  Alert,
  Tabs,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  EditOutlined,
  TeamOutlined,
  BookOutlined,
  HomeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import NotFoundData from "../OtherPage/NotFoundData";
import { useGroupDetails, useGroupDays } from "../../hooks/useGroups";
import type { GroupStudent } from "../../types/group";
import AppBreadcrumb from "../../components/common/AppBreadcrumb";
import StudentMarksSection from "../../components/StudentMarksSection/StudentMarksSection";

const { Title, Text } = Typography;

const PRIMARY_COLOR = "#00A67D";

const GroupsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");

  const {
    group,
    students,
    loading: groupLoading,
    error: groupError,
  } = useGroupDetails(id || "");

  const currentYearMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, []);

  const {
    days: groupDays,
    loading: daysLoading,
    error: daysError,
  } = useGroupDays(
    { groupId: Number(id), yearMonth: currentYearMonth },
    !!id && !groupLoading
  );

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

  if (groupLoading || daysLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." />
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <NotFoundData
        title="Guruh topilmadi"
        description="Ma'lumot yuklanmadi yoki xato yuz berdi."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <AppBreadcrumb
          items={[
            { title: "Dashboard", path: "/" },
            { title: "Guruhlar", path: "/groups" },
            { title: group?.categoryName || "Guruh" },
          ]}
        />

        {/* Group Header Card */}
        <Card className="mb-6! rounded-lg shadow-md">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} className="m-0 dark:text-white">
                <TeamOutlined style={{ color: PRIMARY_COLOR, marginRight: 12 }} />
                {group.name}
              </Title>
              {group.categoryName && (
                <Tag color={PRIMARY_COLOR} className="mt-2">
                  {group.categoryName}
                </Tag>
              )}
            </Col>
          </Row>
        </Card>

        {/* Main content */}
        <Row gutter={[24, 24]}>
          {/* Left - Tabs: Students & Marks */}
          <Col xs={24} lg={16}>
            <Card className="rounded-lg shadow-md">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                tabBarStyle={{ marginBottom: 20 }}
                items={[
                  {
                    key: "students",
                    label: (
                      <span className="flex items-center gap-1.5">
                        <UserOutlined />
                        O'quvchilar
                        <Tag
                          color={PRIMARY_COLOR}
                          style={{ marginLeft: 4, fontSize: 11, padding: "0 6px" }}
                        >
                          {students.length}
                        </Tag>
                      </span>
                    ),
                    children:
                      students.length > 0 ? (
                        <List
                          dataSource={students}
                          renderItem={(student: GroupStudent) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  student.imgUrl ? (
                                    <Avatar size={48} src={student.imgUrl} />
                                  ) : (
                                    <Avatar
                                      size={48}
                                      icon={<UserOutlined />}
                                      style={{ backgroundColor: PRIMARY_COLOR }}
                                    />
                                  )
                                }
                                title={
                                  <Text strong className="dark:text-white">
                                    {student.fulName}
                                  </Text>
                                }
                                description={
                                  <span className="dark:text-gray-400">
                                    📞 {student.phoneNumber}
                                  </span>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty
                          description="Hozircha o'quvchilar yo'q"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      ),
                  },
                  {
                    key: "marks",
                    label: (
                      <span className="flex items-center gap-1.5">
                        <TrophyOutlined />
                        Baholar
                      </span>
                    ),
                    children: (
                      <StudentMarksSection
                        groupId={Number(id)}
                        students={students.map((s: GroupStudent) => ({
                          // ✅ studentId mavjud bo'lmasa id ishlatamiz
                          studentId: (s as any).studentId ?? s.id,
                          fulName: s.fulName,
                        }))}
                      />
                    ),
                  },
                ]}
              />
            </Card>
          </Col>

          {/* Right - Group Info + Calendar */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <span>
                  <BookOutlined style={{ marginRight: 8, color: PRIMARY_COLOR }} />
                  Guruh ma'lumotlari
                </span>
              }
              className="rounded-lg shadow-md mb-6"
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item
                  label={
                    <span>
                      <UserOutlined style={{ color: PRIMARY_COLOR, marginRight: 8 }} />
                      O'qituvchi
                    </span>
                  }
                >
                  <Text className="dark:text-white">
                    {group.teacherName || "Belgilanmagan"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <BookOutlined style={{ color: PRIMARY_COLOR, marginRight: 8 }} />
                      Kategoriya
                    </span>
                  }
                >
                  <Text className="dark:text-white">
                    {group.categoryName || "Belgilanmagan"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <HomeOutlined style={{ color: PRIMARY_COLOR, marginRight: 8 }} />
                      Xona
                    </span>
                  }
                >
                  <Text className="dark:text-white">
                    {group.roomName || "Belgilanmagan"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <ClockCircleOutlined style={{ color: PRIMARY_COLOR, marginRight: 8 }} />
                      Dars vaqti
                    </span>
                  }
                >
                  <Text className="dark:text-white">
                    {group.startTime} – {group.endTime}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <CalendarOutlined style={{ color: PRIMARY_COLOR, marginRight: 8 }} />
                      Dars kunlari
                    </span>
                  }
                >
                  <div>
                    {group.weekDays && group.weekDays.length > 0 ? (
                      group.weekDays.map((day) => (
                        <Tag key={day} color={PRIMARY_COLOR} style={{ marginBottom: 4 }}>
                          {getDayLabel(day)}
                        </Tag>
                      ))
                    ) : (
                      <Text className="dark:text-white">Belgilanmagan</Text>
                    )}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <TeamOutlined style={{ color: PRIMARY_COLOR, marginRight: 8 }} />
                      O'quvchilar soni
                    </span>
                  }
                >
                  <Text strong style={{ color: PRIMARY_COLOR }}>
                    {students.length} ta
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {!daysLoading && (
              <Card
                title={
                  <span>
                    <CalendarOutlined style={{ marginRight: 8, color: PRIMARY_COLOR }} />
                    {currentYearMonth} - dars kunlari
                  </span>
                }
                className="rounded-lg shadow-md mt-4!"
              >
                {daysError ? (
                  <Alert
                    message="Xatolik"
                    description="Dars kunlarini yuklashda xatolik yuz berdi"
                    type="error"
                    showIcon
                  />
                ) : groupDays.length > 0 ? (
                  <>
                    <Text
                      strong
                      className="dark:text-white"
                      style={{ display: "block", marginBottom: 12 }}
                    >
                      Jami: {groupDays.length} kun
                    </Text>
                    <Divider style={{ margin: "12px 0" }} />
                    <div style={{ maxHeight: 300, overflowY: "auto" }}>
                      {groupDays.map((day, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{ marginBottom: 8, padding: "4px 12px", fontSize: 13 }}
                        >
                          {new Date(day).toLocaleDateString("uz-UZ", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Tag>
                      ))}
                    </div>
                  </>
                ) : (
                  <Empty
                    description="Bu oyda dars kunlari yo'q"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GroupsDetail;