import React, { useState } from "react";
import {
  Avatar,
  Card,
  Space,
  Typography,
  Tag,
  Spin,
  Result,
  Divider,
  Row,
  Col,
  Empty,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  LockOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../components/Modal/Modal";
import IconButton from "../../components/IconButton/IconButton";
import DetailDescriptions, {
  DetailItem,
} from "../../components/DetailDescriptions/DetailDescriptions";
import PhoneInput from "../../components/Input/PhoneInput";
import { useTeacherDetail } from "../../hooks/useTeacherDetail";

const { Title, Text } = Typography;

const TeachersDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const { teacher, loading, error, refetch, isRefetching } =
    useTeacherDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen p-6">
        <Result
          status="error"
          title="Ma'lumot topilmadi"
          extra={
            <Space>
              <IconButton
                text="Qayta urinish"
                type="primary"
                icon={<ReloadOutlined />}
                loading={isRefetching}
                onClick={() => refetch()}
              />
              <IconButton
                text="Orqaga"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/teachers")}
              />
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">
          O'qituvchi profili
        </Title>

        <IconButton
          text="Parolni o'zgartirish"
          type="primary"
          danger
          icon={<LockOutlined />}
          onClick={() => setIsPasswordModalVisible(true)}
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* LEFT PROFILE CARD */}
        <Col xs={24} lg={8}>
          <Card
            className="text-center shadow-md rounded-xl"
            styles={{ body: { padding: 30 } }}
          >
            <Avatar
              size={140}
              icon={<UserOutlined />}
              src={teacher.imageUrl}
              className="mb-4 shadow"
            />

            <Title level={4}>{teacher.fullName}</Title>

            <Tag color="blue" icon={<BookOutlined />}>
              O'qituvchi
            </Tag>

            <Divider />

            <Space orientation="vertical">
              <Space>
                <PhoneOutlined />
                <PhoneInput value={teacher.phone} />
              </Space>
            </Space>
          </Card>
        </Col>

        {/* RIGHT CONTENT */}
        <Col xs={24} lg={16}>
          <Card className="shadow-md rounded-xl mb-6!">
            <Title level={5}>Asosiy ma'lumotlar</Title>

            <DetailDescriptions>
              <DetailItem label="To'liq ism">
                <Text strong>{teacher.fullName}</Text>
              </DetailItem>

              <DetailItem label="Telefon">
                <PhoneInput value={teacher.phone} />
              </DetailItem>
            </DetailDescriptions>
          </Card>

          {/* GROUPS */}
          <Card className="shadow-md rounded-xl mb-6!">
            <Title level={5} className="flex gap-2 items-center">
              <TeamOutlined /> Guruhlar
              <Text className="text-[18px]!">
                {teacher.groupList?.length || 0} ta
              </Text>
            </Title>

            {teacher.groupList?.length ? (
              teacher.groupList.map((group) => (
                <Card
                  key={group.id}
                  size="small"
                  className="mb-3 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Text strong>{group.name}</Text>
                      <br />
                      <Text type="secondary">
                        <ClockCircleOutlined /> {group.startTime} -{" "}
                        {group.endTime}
                      </Text>
                    </div>

                    <Tag color="purple">{group.categoryName}</Tag>
                  </div>

                  <Divider className="my-2" />

                  <Text type="secondary">Xona: {group.roomName}</Text>
                </Card>
              ))
            ) : (
              <Empty description="Guruh mavjud emas" />
            )}
          </Card>

          {/* STUDENTS */}
          <Card className="shadow-md rounded-xl">
            <Title level={5} className="flex items-center gap-2">
              <UserOutlined /> O'quvchilar
              <Text className="text-[18px]!">{teacher.studentList?.length || 0} ta</Text>
            </Title>

            {teacher.studentList?.length ? (
              teacher.studentList.map((student) => (
                <Card
                  key={student.id}
                  size="small"
                  className="mb-3 rounded-lg bg-gray-50"
                >
                  <Text strong>{student.fulName}</Text>
                  <br />
                  <Text type="secondary">{student.phoneNumber}</Text>
                  <br />
                  <Tag color="blue">{student.groupName}</Tag>
                </Card>
              ))
            ) : (
              <Empty description="O'quvchi mavjud emas" />
            )}
          </Card>
        </Col>
      </Row>

      {/* MODAL */}
      <ModalComponent
        open={isPasswordModalVisible}
        title="Parolni o'zgartirish"
        onOk={() => setIsPasswordModalVisible(false)}
        onCancel={() => setIsPasswordModalVisible(false)}
      >
        <Text>Bu yerda keyinchalik parolni o'zgartirish formasi bo'ladi.</Text>
      </ModalComponent>
    </div>
  );
};

export default TeachersDetail;
