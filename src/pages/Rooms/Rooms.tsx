import { useState } from "react";
import { Card, Row, Col, Button, Spin, Form, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import IconButton from "../../components/IconButton/IconButton";
import ModalComponent from "../../components/Modal/Modal";
import InputComponent from "../../components/Input/Input";
import { useRooms } from "../../hooks/useRooms";
import { Room } from "../../types/room";
import NotFoundData from "../OtherPage/NotFoundData";
import { Link } from "react-router";
import ListHeader from "../../components/ListHeader/ListHeader";

const Rooms = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [search, setSearch] = useState("");
  const {
    rooms,
    loading,
    error,
    createRoom,
    isCreating,
    updateRoom,
    isUpdating,
    deleteRoom,
    isDeleting,
  } = useRooms(search);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const showModal = (room: Room | null = null) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
    if (room) {
      form.setFieldsValue({ name: room.name });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (selectedRoom) {
        updateRoom(
          {
            id: selectedRoom.id,
            name: values.name,
          },
          {
            onSuccess: () => {
              handleCancel();
            },
          },
        );
      } else {
        createRoom(
          { name: values.name },
          {
            onSuccess: () => {
              handleCancel();
            },
          },
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };
  const handleDelete = (roomId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    deleteRoom(roomId);
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      {/* Header */}
      <ListHeader
        title={t("rooms")}
        count={rooms.length}
        searchValue={search}
        onSearchChange={(value) => setSearch(value)}
        searchPlaceholder={t("searchRooms")}
        buttonText={t("addRoom")}
        onButtonClick={() => showModal()}
      />

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip={t("loading")} />
        </div>
      )}

      {/* Rooms list */}
      {!loading && !error && (
        <>
          {rooms.length === 0 ? (
            <NotFoundData
              title={t("noRoomsAvailable")}
              description={t("noRoomsYetMessage")}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {rooms.map((room) => (
                <Col xs={24} sm={12} md={8} key={room.id}>
                  <Card
                    hoverable
                    className="cursor-pointer dark:bg-gray-800"
                    bodyStyle={{ padding: "0 12px" }}
                    title={
                      <div className="flex items-center justify-between">
                        <span className="dark:text-gray-200">{room.name}</span>
                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => showModal(room)}
                            className="dark:text-gray-400 dark:hover:text-gray-200"
                          />
                          <Popconfirm
                            title={t("deleteRoomConfirm")}
                            description={t("areYouSureDeleteRoom")}
                            onConfirm={() => handleDelete(room.id)}
                            okText={t("yes")}
                            cancelText={t("no")}
                            okButtonProps={{ loading: isDeleting }}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              danger
                              className="dark:text-red-400 dark:hover:text-red-300"
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    }
                  >
                    <Link to={`/room/${room.id}`} className="w-full h-full">
                      <p className="text-sm py-5 px-3 text-gray-500 dark:text-gray-400">
                        {t("clickToViewRoomAvailability")}
                      </p>
                    </Link>
                    {room.schedules && room.schedules.length > 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {room.schedules.length} {t("schedules")}
                      </p>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Modal */}
      <ModalComponent
        open={isModalVisible}
        onCancel={handleCancel}
        title={selectedRoom ? t("editRoom") : t("addRoom")}
        footer={[
          <Button key="close" onClick={handleCancel} disabled={isSaving}>
            {t("close")}
          </Button>,
          <IconButton
            text={t("save")}
            key="save"
            onClick={handleSave}
            loading={isSaving}
            type="primary"
          />,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t("roomName")}
            rules={[
              {
                required: true,
                message: `${t("please")} ${t("enterRoomName")}`,
              },
              { min: 2, message: t("roomNameMinLength") },
            ]}
          >
            <InputComponent placeholder={t("enterRoomName")} />
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Rooms;
