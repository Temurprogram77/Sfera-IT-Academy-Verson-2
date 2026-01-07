import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Modal,
  List,
  Avatar,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
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

const Rooms = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const showModal = (room) => {
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
          colorBgContainer: theme === "dark" ? "#111827" : "#ffffff",
          colorText: theme === "dark" ? "#e5e7eb" : "#111827",
          colorBorder: theme === "dark" ? "#374151" : "#e5e7eb",
        },
      }}
    >
      <div className="p-4 bg-white dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold dark:text-gray-200">Xonalar</h2>
          <Button type="primary" icon={<PlusOutlined />}>
            Xona qo‘shish
          </Button>
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
                  Batafsil ko‘rish uchun bosing
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal */}
        {selectedRoom && (
          <Modal
            title={
              <div className="flex items-center gap-3">
                <img
                  src={
                    theme === "dark"
                      ? selectedRoom.img.dark
                      : selectedRoom.img.light
                  }
                  alt={selectedRoom.name}
                  className="w-8 h-8 object-contain"
                />
                <span>{selectedRoom.name}</span>
              </div>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="close" onClick={handleCancel}>
                Yopish
              </Button>,
            ]}
          >
            <div className="mb-4">
              <Tag color={selectedRoom.status === "active" ? "green" : "red"}>
                {selectedRoom.status === "active" ? "Faol" : "Faol emas"}
              </Tag>
            </div>

            <h4 className="mb-2 font-medium">Guruhlar:</h4>
            <List
              bordered
              dataSource={selectedRoom.groups}
              renderItem={(group) => (
                <List.Item>
                  <Avatar style={{ backgroundColor: "#18A752" }} size="small">
                    {group[0]}
                  </Avatar>
                  <span className="ml-2">{group}</span>
                </List.Item>
              )}
            />
          </Modal>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Rooms;
