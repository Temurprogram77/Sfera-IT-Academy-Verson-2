// pages/ParentDetail/ParentDetail.tsx
import React, { useState } from "react";
import {
  Avatar,
  Card,
  Descriptions,
  Space,
  Typography,
  Tag,
  Spin,
  Result,
  Button,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../components/Modal/Modal";
import { ChangePasswordFormValues } from "../../types/parent";
import { toast } from "sonner";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import IconButton from "../../components/IconButton/IconButton";
import InputComponent from "../../components/Input/Input";
import { useParentDetail } from "../../hooks/useParentDetail";

const { Title, Text } = Typography;

const ParentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = FormWrapper.useForm<ChangePasswordFormValues>();

  // Hook orqali parent ma'lumotlarini olish
  const { parent, loading, error, refetch, isRefetching } = useParentDetail(id);

  const handlePasswordChange = async () => {
    try {
      // const values = await form.validateFields();
      setConfirmLoading(true);

      // TODO: API ga parol o'zgartirish uchun so'rov yuborish
      // await updateParentPassword(id, values);

      setTimeout(() => {
        toast.success("Parol muvaffaqiyatli o'zgartirildi");
        setIsPasswordModalVisible(false);
        form.resetFields();
        setConfirmLoading(false);
      }, 1500);
    } catch (error) {
      setConfirmLoading(false);
      toast.error("Parolni o'zgartirishda xatolik yuz berdi");
      console.error(error);
    }
  };

  const getRoleColor = (role: string) => {
    return "green"; // Parent uchun yashil rang
  };

  const getRoleText = (role: string) => {
    return "Ota-ona";
  };

  const formatPhone = (phone: string) => {
    // +998 90 854 75 65 formatga o'tkazish
    if (phone.startsWith("998")) {
      return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10)}`;
    }
    return phone;
  };

  // Loading holati
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." />
      </div>
    );
  }

  // Error holati
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <Result
          status="error"
          title="Xatolik yuz berdi"
          subTitle="Ota-ona ma'lumotlarini yuklashda muammo yuz berdi"
          extra={[
            <Button
              type="primary"
              key="retry"
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isRefetching}
            >
              Qayta urinish
            </Button>,
            <Button key="back" onClick={() => navigate("/parents")}>
              Orqaga
            </Button>,
          ]}
        />
      </div>
    );
  }

  // Parent topilmagan holati
  if (!parent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <Result
          status="404"
          title="Ota-ona topilmadi"
          subTitle="Bunday ID bilan ota-ona mavjud emas"
          extra={
            <Button type="primary" onClick={() => navigate("/parents")}>
              Ota-onalar ro'yxatiga qaytish
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="!mb-1">
              Ota-ona ma'lumotlari
            </Title>
          </div>
          <IconButton
            text="Parolni o'zgartirish"
            type="primary"
            danger
            icon={<LockOutlined />}
            onClick={() => setIsPasswordModalVisible(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <Card
          bordered={false}
          className="shadow-sm h-fit"
          bodyStyle={{ textAlign: "center", padding: "32px 24px" }}
        >
          <div className="flex flex-col items-center">
            <Avatar
              size={140}
              icon={<UserOutlined />}
              src={parent.imageUrl}
              className="mb-5 shadow-lg"
              style={{
                border: "4px solid #f0f0f0",
              }}
            />

            <Title level={4} className="!mb-2">
              {parent.fullName}
            </Title>

            <Tag
              color={getRoleColor(parent.role)}
              icon={<SafetyCertificateOutlined />}
              className="mb-3"
              style={{ fontSize: "14px", padding: "4px 12px" }}
            >
              {getRoleText(parent.role)}
            </Tag>

            <Space direction="vertical" className="w-full mt-4" size={12}>
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                <PhoneOutlined />
                <Text>{formatPhone(parent.phone)}</Text>
              </div>
            </Space>
          </div>
        </Card>

        {/* Right Column - Details */}
        <Card
          bordered={false}
          className="shadow-sm lg:col-span-2"
          title={
            <span className="text-lg font-semibold">Batafsil ma'lumotlar</span>
          }
        >
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="To'liq ism" span={2}>
              <Text strong>{parent.fullName}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Telefon raqami" span={2}>
              <Space>
                <PhoneOutlined className="text-blue-500" />
                <Text copyable>{formatPhone(parent.phone)}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>

          {/* Additional Info Section */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Space direction="vertical" size={8} className="w-full">
              <div className="flex items-start gap-2">
                <SafetyCertificateOutlined className="text-green-600 mt-1" />
                <div>
                  <Text strong className="block mb-1">
                    Farzandlar
                  </Text>
                  <Text type="secondary" className="text-sm">
                    Bu ota-ona o'z farzandlarining o'quv jarayonini kuzatish
                    imkoniyatiga ega. Farzandlar ro'yxati va batafsil
                    ma'lumotlar alohida bo'limda ko'rsatiladi.
                  </Text>
                </div>
              </div>
            </Space>
          </div>
        </Card>
      </div>

      {/* Password Change Modal */}
      <ModalComponent
        open={isPasswordModalVisible}
        title="Parolni o'zgartirish"
        onOk={handlePasswordChange}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          form.resetFields();
        }}
        okText="O'zgartirish"
        cancelText="Bekor qilish"
        confirmLoading={confirmLoading}
      >
        <FormWrapper form={form} layout="vertical" className="mt-4">
          <FormWrapper.Item
            name="currentPassword"
            label="Joriy parol"
            rules={[
              { required: true, message: "Joriy parolni kiriting" },
              {
                min: 6,
                message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
              },
            ]}
          >
            <InputComponent
              variant="password"
              prefix={<LockOutlined />}
              placeholder="Joriy parolni kiriting"
            />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="newPassword"
            label="Yangi parol"
            rules={[
              { required: true, message: "Yangi parolni kiriting" },
              {
                min: 6,
                message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
              },
            ]}
          >
            <InputComponent
              variant="password"
              prefix={<LockOutlined />}
              placeholder="Yangi parolni kiriting"
            />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="confirmPassword"
            label="Parolni tasdiqlash"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Parolni tasdiqlang" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Parollar bir xil emas!"));
                },
              }),
            ]}
          >
            <InputComponent
              variant="password"
              prefix={<LockOutlined />}
              placeholder="Parolni qayta kiriting"
            />
          </FormWrapper.Item>
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default ParentDetail;
