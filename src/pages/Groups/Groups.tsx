import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Popconfirm,
  Select,
  Spin,
  TimePicker,
  Tag,
  Button,
  message,
} from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useGroups, useGroupDetails } from "../../hooks/useGroups";
import { useTeacher } from "../../hooks/useTeacher"; // Teacher hook import
import { useRooms } from "../../hooks/useRooms"; // Room hook import
import { Group, WeekDay, CreateGroupDto, UpdateGroupDto } from "../../types/group";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { EyeOutlined } from "@ant-design/icons";
import NotFoundData from "../OtherPage/NotFoundData";
import dayjs from "dayjs";
import {
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#00A67D";

const Groups = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const {
    groups,
    loading,
    pagination,
    createGroup,
    updateGroup,
    deleteGroup,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGroups({ name: searchTerm, page: currentPage, size: pageSize });

  const { teachers, isLoading: teachersLoading } = useTeacher(); // Teacherlarni olish
  const { rooms, loading: roomsLoading } = useRooms(); // Roomlarni olish

  const { group: editingGroup, loading: groupDetailsLoading } = useGroupDetails(editingGroupId || 0); // Edit uchun detail olish

  const weekDaysOptions = [
    { value: WeekDay.MONDAY, label: "Dushanba" },
    { value: WeekDay.TUESDAY, label: "Seshanba" },
    { value: WeekDay.WEDNESDAY, label: "Chorshanba" },
    { value: WeekDay.THURSDAY, label: "Payshanba" },
    { value: WeekDay.FRIDAY, label: "Juma" },
    { value: WeekDay.SATURDAY, label: "Shanba" },
    { value: WeekDay.SUNDAY, label: "Yakshanba" },
  ];

  const getWeekDayLabel = (day: string) => {
    const option = weekDaysOptions.find((opt) => opt.value === day);
    return option?.label || day;
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingGroupId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (group: Group) => {
    setIsEditMode(true);
    setEditingGroupId(group.id);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (isEditMode && editingGroup && !groupDetailsLoading) {
      form.setFieldsValue({
        name: editingGroup.name,
        startTime: editingGroup.startTime ? dayjs(editingGroup.startTime, "HH:mm") : null,
        endTime: editingGroup.endTime ? dayjs(editingGroup.endTime, "HH:mm") : null,
        weekDays: editingGroup.weekDays || [],
        teacherId: editingGroup.teacherId,
        categoryId: editingGroup.categoryId,
        roomId: editingGroup.roomId,
      });
    }
  }, [editingGroup, groupDetailsLoading, isEditMode, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const groupData: CreateGroupDto | UpdateGroupDto = {
        name: values.name.trim(),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
        weekDays: values.weekDays,
        teacherId: values.teacherId,
        categoryId: values.categoryId || 1, // Default 1
        roomId: values.roomId,
      };

      if (isEditMode && editingGroupId) {
        updateGroup({ id: editingGroupId, ...groupData }, {
          onSuccess: () => {
            setIsModalVisible(false);
            form.resetFields();
            message.success("Guruh yangilandi");
          },
        });
      } else {
        createGroup(groupData, {
          onSuccess: () => {
            setIsModalVisible(false);
            form.resetFields();
            message.success("Yangi guruh qo'shildi");
          },
        });
      }
    } catch (error) {
      message.error("Ma'lumotlar to'liq emas yoki xato");
      console.error("Validation error:", error);
    }
  };

  const handleDelete = (id: number) => {
    deleteGroup(id);
  };

  const handleView = (id: number) => {
    navigate(`/groups/${id}`);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ListHeader
          title={t("groupsCount")}
          count={groups.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("searchGroup")}
          buttonText={t("addGroup")}
          onButtonClick={openAddModal}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
        />

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Spin size="large" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Guruhlar yuklanmoqda...</p>
          </div>
        ) : groups.length === 0 ? (
          <NotFoundData
            title="Guruhlar topilmadi"
            description="Hozircha hech qanday guruh qo'shilmagan. Yangi guruh qo'shish uchun yuqoridagi tugmani bosing."
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <TableComponent<Group>
              data={groups}
              itemName={t("groups")}
              searchKeys={["name", "teacherName", "categoryName"]}
              columnsConfig={[
                {
                  key: "group",
                  title: t("group"),
                  render: (record) => (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                      >
                        {record.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {record.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {record.studentCount} o'quvchi
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "teacher",
                  title: t("teacher"),
                  render: (record) => (
                    <div className="flex items-center gap-2">
                      <UserOutlined style={{ color: PRIMARY_COLOR }} />
                      <span>{record.teacherName || "Belgilanmagan"}</span>
                    </div>
                  ),
                },
                {
                  key: "category",
                  title: t("category"),
                  render: (record) => (
                    <Tag color={PRIMARY_COLOR}>{record.categoryName}</Tag>
                  ),
                },
                {
                  key: "actions",
                  title: t("actions"),
                  render: (record) => (
                    <div className="flex gap-2">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record.id)}
                        style={{ color: PRIMARY_COLOR }}
                      />
                      <Button
                        icon={<PencilIcon />}
                        onClick={() => openEditModal(record)}
                        style={{ color: PRIMARY_COLOR }}
                      />
                      <Popconfirm
                        title="O'chirish"
                        onConfirm={() => handleDelete(record.id)}
                      >
                        <Button icon={<TrashBinIcon />} danger />
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
              pagination={{
                current: currentPage + 1,
                pageSize: pageSize,
                total: pagination.totalElements,
                onChange: handlePageChange,
              }}
            />
          </div>
        )}

        <ModalComponent
          open={isModalVisible}
          title={isEditMode ? t("editGroup") : t("addGroup")}
          onOk={handleSave}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: PRIMARY_COLOR } }}
          confirmLoading={isCreating || isUpdating || groupDetailsLoading}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Nomi" rules={[{ required: true }]}>
              <Input placeholder="Guruh nomi" />
            </Form.Item>
            <Form.Item name="startTime" label="Boshlanish vaqti" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
            <Form.Item name="endTime" label="Tugash vaqti" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
            <Form.Item name="weekDays" label="Kunlar" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="Kunlarni tanlang">
                {weekDaysOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="teacherId" label="O'qituvchi" rules={[{ required: true }]}>
              <Select placeholder="O'qituvchini tanlang" loading={teachersLoading}>
                {teachers.map((teacher) => (
                  <Select.Option key={teacher.id} value={teacher.id}>
                    {teacher.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="categoryId" label="Kategoriya" rules={[{ required: true }]}>
              <Select placeholder="Kategoriyani tanlang">
                <Select.Option value={1}>1</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="roomId" label="Xona" rules={[{ required: true }]}>
              <Select placeholder="Xonani tanlang" loading={roomsLoading}>
                {rooms.map((room) => (
                  <Select.Option key={room.id} value={room.id}>
                    {room.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </ModalComponent>
      </div>
    </div>
  );
};

export default Groups;