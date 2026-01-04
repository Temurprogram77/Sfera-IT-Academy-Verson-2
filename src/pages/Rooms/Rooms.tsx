import { useState } from "react";
import { Card, Row, Col, Button, Tag, Modal, List, Avatar } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Room tipini belgilaymiz
interface Room {
  id: number;
  name: string;
  status: "active" | "inactive";
  img: string;
  groups: string[];
}

// Xonalar ma’lumotlari
const rooms: Room[] = [
  {
    id: 1,
    name: "Google",
    status: "active",
    img: "/src/assets/icons/google.png",
    groups: ["Python-1", "Python-2"],
  },
  {
    id: 2,
    name: "ChatGPT",
    status: "inactive",
    img: "/src/assets/icons/chatgpt.png",
    groups: ["Frontend-1", "Frontend-2"],
  },
  {
    id: 3,
    name: "Midjourney",
    status: "active",
    img: "/src/assets/icons/Midjourney.svg",
    groups: ["Design-1", "Design-2"],
  },
];

const Rooms = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const showModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Xonalar</h2>
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
              style={{ cursor: "pointer" }}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={room.img}
                    alt={room.name}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  <span>{room.name}</span>
                </div>
              }
              extra={
                <Tag color={room.status === "active" ? "green" : "red"}>
                  {room.status === "active" ? "Faol" : "Faol emas"}
                </Tag>
              }
            >
              <p>Click card to view details</p> {/* children bo'lishi shart */}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      {selectedRoom && (
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={selectedRoom.img}
                alt={selectedRoom.name}
                style={{ width: 32, height: 32, objectFit: "contain" }}
              />
              <span>{selectedRoom.name}</span>
            </div>
          }
          open={isModalVisible} // <-- v5 da 'open' ishlatiladi
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Yopish
            </Button>,
          ]}
        >
          <div style={{ marginBottom: 16 }}>
            <Tag color={selectedRoom.status === "active" ? "green" : "red"}>
              {selectedRoom.status === "active" ? "Faol" : "Faol emas"}
            </Tag>
          </div>

          <h4>Guruhlar:</h4>
          <List
            bordered
            dataSource={selectedRoom.groups}
            renderItem={(group) => (
              <List.Item>
                <Avatar
                  style={{ backgroundColor: "#18A752" }}
                  size="small"
                  gap={8}
                >
                  {group[0]}
                </Avatar>
                <span style={{ marginLeft: 8 }}>{group}</span>
              </List.Item>
            )}
          />
        </Modal>
      )}
    </div>
  );
};

export default Rooms;
