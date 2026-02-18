import React, { useState } from "react";
import { Avatar, Card, Space, Typography, Tag, Spin, Result } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../components/Modal/Modal";
import { ChangePasswordFormValues } from "../../types/admin";
import { toast } from "sonner";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import IconButton from "../../components/IconButton/IconButton";
import InputComponent from "../../components/Input/Input";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import DetailDescriptions, {
  DetailItem,
} from "../../components/DetailDescriptions/DetailDescriptions";
import PhoneInput from "../../components/Input/PhoneInput";
import AppBreadcrumb from "../../components/common/AppBreadcrumb";

const { Title, Text } = Typography;

const AdminDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = FormWrapper.useForm<ChangePasswordFormValues>();

  const { admin, loading, error, refetch, isRefetching } = useAdminDetail(id);

  const handlePasswordChange = async () => {
    try {
      setConfirmLoading(true);
      setTimeout(() => {
        toast.success("Parol muvaffaqiyatli o'zgartirildi");
        setIsPasswordModalVisible(false);
        form.resetFields();
        setConfirmLoading(false);
      }, 1500);
    } catch (error) {
      setConfirmLoading(false);
      toast.error("Parolni o'zgartirishda xatolik yuz berdi");
    }
  };

  const getRoleColor = (role: string) => {
    if (role === "ROLE_SUPER_ADMIN") return "red";
    if (role === "ROLE_ADMIN") return "blue";
    return "default";
  };

  const getRoleText = (role: string) => {
    if (role === "ROLE_SUPER_ADMIN") return "Super Admin";
    if (role === "ROLE_ADMIN") return "Admin";
    return role;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !admin) {
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
                onClick={() => navigate("/admins")}
              />
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <AppBreadcrumb
        items={[
          { title: "Dashboard", path: "/" },
          { title: "Adminlar", path: "/admins" },
          { title: admin?.fullName || "Admin" },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Admin ma'lumotlari</Title>

        <IconButton
          text="Parolni o'zgartirish"
          type="primary"
          danger
          icon={<LockOutlined />}
          onClick={() => setIsPasswordModalVisible(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <Avatar
            size={140}
            icon={<UserOutlined />}
            src={admin.imageUrl}
            className="mb-4"
          />

          <Title level={4}>{admin.fullName}</Title>

          <Tag
            color={getRoleColor(admin.role)}
            icon={<SafetyCertificateOutlined />}
          >
            {getRoleText(admin.role)}
          </Tag>

          <div className="mt-4 flex justify-center items-center gap-2">
            <PhoneOutlined />
            <PhoneInput value={admin.phone} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <Title level={5} className="mb-4">
            Batafsil ma'lumotlar
          </Title>

          <DetailDescriptions>
            <DetailItem label="To'liq ism">
              <Text strong>{admin.fullName}</Text>
            </DetailItem>

            <DetailItem label="Telefon raqami">
              <PhoneInput value={admin.phone} />
            </DetailItem>

            <DetailItem label="Rol">
              <Tag
                color={getRoleColor(admin.role)}
                icon={<SafetyCertificateOutlined />}
              >
                {getRoleText(admin.role)}
              </Tag>
            </DetailItem>

            {admin.imageUrl && (
              <DetailItem label="Rasm URL">
                <Text copyable>{admin.imageUrl}</Text>
              </DetailItem>
            )}
          </DetailDescriptions>
        </Card>
      </div>

      <ModalComponent
        open={isPasswordModalVisible}
        title="Parolni o'zgartirish"
        onOk={handlePasswordChange}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={confirmLoading}
      >
        <FormWrapper form={form} layout="vertical">
          <FormWrapper.Item
            name="currentPassword"
            label="Joriy parol"
            rules={[{ required: true }]}
          >
            <InputComponent variant="password" />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="newPassword"
            label="Yangi parol"
            rules={[{ required: true, min: 6 }]}
          >
            <InputComponent variant="password" />
          </FormWrapper.Item>

          <FormWrapper.Item
            name="confirmPassword"
            label="Tasdiqlash"
            dependencies={["newPassword"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Parollar bir xil emas"));
                },
              }),
            ]}
          >
            <InputComponent variant="password" />
          </FormWrapper.Item>
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default AdminDetail;
