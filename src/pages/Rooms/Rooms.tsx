import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  ConfigProvider,
  theme as antdTheme,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import IconButton from "../../components/IconButton/IconButton";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";

const rooms = [
  {
    id: 1,
    name: "Google",
    status: "active",
    img: {
      light: "/src/assets/icons/google.png",
      dark: "/src/assets/icons/google.png",
    },
    groups: ["Python-1", "Python-2"],
  },
  {
    id: 2,
    name: "ChatGPT",
    status: "inactive",
    img: {
      light: "/src/assets/icons/chatgpt.png",
      dark: "/src/assets/icons/chatgpt2.png",
    },
    groups: ["Frontend-1", "Frontend-2"],
  },
  {
    id: 3,
    name: "Midjourney",
    status: "active",
    img: {
      light: "/src/assets/icons/Midjourney.svg",
      dark: "/src/assets/icons/midjourney2.png",
    },
    groups: ["Design-1", "Design-2"],
  },
];

interface Room {
  id: number;
  name: string;
  status: string;
  img: { light: string; dark: string };
  groups: string[];
}

const Rooms = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const showModal = (room: Room | null = null) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: theme === "dark" ? "#101828" : "#ffffff", // shu yer
          colorText: theme === "dark" ? "#e5e7eb" : "#111827",
          colorBorder: theme === "dark" ? "#374151" : "#e5e7eb",
        },
      }}
    >
      <div className="p-4 bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold dark:text-gray-200">
            {t("rooms")}
          </h2>
          <IconButton
            icon={<PlusOutlined />}
            text={t("addRoom")}
            onClick={() => showModal()}
            type="primary"
          />
        </div>

        {/* Rooms list */}
        <Row gutter={[16, 16]}>
          {rooms.map((room) => (
            <Col xs={24} sm={12} md={8} key={room.id}>
              <Card
                hoverable
                onClick={() => showModal(room)}
                className="cursor-pointer dark:bg-gray-800"
                title={
                  <div className="flex items-center gap-2">
                    <img
                      src={theme === "dark" ? room.img.dark : room.img.light}
                      alt={room.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="dark:text-gray-200">{room.name}</span>
                  </div>
                }
                extra={
                  <Tag color={room.status === "active" ? "green" : "red"}>
                    {room.status === "active" ? "Faol" : "Faol emas"}
                  </Tag>
                }
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("clickToViewDetails")}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal */}
        <ModalComponent
          open={isModalVisible}
          onCancel={handleCancel}
          title={selectedRoom ? t("editRoom") : t("addRoom")}
          footer={[
            <Button key="close" onClick={handleCancel}>
              {t("close")}
            </Button>,
            <IconButton text={t("save")} key="save" onClick={handleCancel} />,
          ]}
        >
          <div>
            <p className="text-gray-500">{t("Xona qo'shish")}</p>
            <InputComponent placeholder="Xona nomini Kiriting" className=""/>
          </div>
        </ModalComponent>
      </div>
    </ConfigProvider>
  );
};

export default Rooms;
