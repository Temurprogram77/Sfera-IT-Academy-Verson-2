// src/pages/Groups/Groups.tsx
import { useState, useEffect } from "react";
import { Popconfirm, Spin, TimePicker, Tag } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useGroups, useGroupDetails } from "../../hooks/useGroups";
import { useSimpleTeachers } from "../../hooks/useSimpleTeachers";
import { useRooms } from "../../hooks/useRooms";
import {
  Group,
  WeekDay,
  CreateGroupDto,
  UpdateGroupDto,
} from "../../types/group";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { EyeOutlined } from "@ant-design/icons";
import NotFoundData from "../OtherPage/NotFoundData";
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import IconButton from "../../components/IconButton/IconButton";
import InputComponent from "../../components/Input/Input";
import SelectComponent from "../../components/Select/Select";
import { useCategories } from "../../hooks/useCategory";

const PRIMARY_COLOR = "#00A67D";

const Groups = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form] = FormWrapper.useForm();
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
  } = useGroups({ name: searchTerm, page: currentPage, size: pageSize });

  const { teachers, isLoading: teachersLoading } = useSimpleTeachers();
  const { rooms, loading: roomsLoading } = useRooms();
  const { categories, loading: categoryLoading } = useCategories();

  const { group: editingGroup, loading: groupDetailsLoading } = useGroupDetails(
    editingGroupId || 0,
  );

  const weekDaysOptions = [
    { value: WeekDay.oddDays, label: "Toq kunlari" },
    { value: WeekDay.evenDays, label: "Juft kunlari" },
    { value: WeekDay.otherDays, label: "Boshqa kunlar" },
  ];

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
        startTime: editingGroup.startTime
          ? dayjs(editingGroup.startTime, "HH:mm")
          : null,
        endTime: editingGroup.endTime
          ? dayjs(editingGroup.endTime, "HH:mm")
          : null,
        // ✅ weekDays allaqachon string[] bo'lib keladi — to'g'ridan-to'g'ri set qilinadi
        weekDays: editingGroup.weekDays ?? [],
        teacherId: editingGroup.teacherId,
        categoryId: editingGroup.categoryId,
        roomId: editingGroup.roomId,
      });
    }
  }, [editingGroup, groupDetailsLoading, isEditMode, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // ✅ weekDays: values.weekDays endi string[] bo'ladi (multi-select)
      const groupData: CreateGroupDto | UpdateGroupDto = {
        name: values.name.trim(),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
        weekDays: values.weekDays as string[],   // ✅ array holida yuboriladi
        teacherId: values.teacherId,
        categoryId: values.categoryId || 1,
        roomId: values.roomId,
      };

      if (isEditMode && editingGroupId) {
        updateGroup(
          { id: editingGroupId, ...groupData },
          {
            onSuccess: () => {
              setIsModalVisible(false);
              form.resetFields();
            },
          },
        );
      } else {
        createGroup(groupData, {
          onSuccess: () => {
            setIsModalVisible(false);
            form.resetFields();
          },
        });
      }
    } catch (error) {
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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <ListHeader
          title={t("groupsCount")}
          count={groups.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("searchGroup")}
          buttonText={t("addGroup")}
          onButtonClick={openAddModal}
          buttonStyle={{
            backgroundColor: PRIMARY_COLOR,
            borderColor: PRIMARY_COLOR,
          }}
        />

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Spin size="large" />
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
                          {record.studentCount ?? 0} o'quvchi
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
                      <span className="dark:text-gray-300">
                        {record.teacherName || "Belgilanmagan"}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "category",
                  title: t("category"),
                  render: (record) => (
                    <Tag color={PRIMARY_COLOR}>
                      {record.categoryName || "—"}
                    </Tag>
                  ),
                },
                {
                  render: (record) => (
                    <div className="flex gap-2">
                      <IconButton
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record.id)}
                      />
                      <IconButton
                        icon={<PencilIcon />}
                        onClick={() => openEditModal(record)}
                        warning
                      />
                      <Popconfirm
                        title="O'chirish"
                        description="Bu guruhni o'chirmoqchimisiz?"
                        okText="Ha"
                        cancelText="Yo'q"
                        onConfirm={() => handleDelete(record.id)}
                      >
                        <span>
                          <IconButton icon={<TrashBinIcon />} danger />
                        </span>
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
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
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
          <FormWrapper form={form} layout="vertical">
            <FormWrapper.Item
              name="name"
              label="Nomi"
              rules={[{ required: true, message: "Guruh nomini kiriting" }]}
            >
              <InputComponent placeholder="Guruh nomi" />
            </FormWrapper.Item>

            <div className="grid grid-cols-2 gap-3">
              <FormWrapper.Item
                name="startTime"
                label="Boshlanish vaqti"
                rules={[{ required: true, message: "Vaqtni tanlang" }]}
              >
                <TimePicker
                  format="HH:mm"
                  className="w-full"
                  hideDisabledOptions
                  disabledTime={() => ({
                    disabledHours: () => [
                      ...Array.from({ length: 8 }, (_, i) => i),
                      ...Array.from({ length: 3 }, (_, i) => i + 21),
                    ],
                  })}
                />
              </FormWrapper.Item>

              <FormWrapper.Item
                shouldUpdate={(p, c) => p.startTime !== c.startTime}
              >
                {({ getFieldValue }) => {
                  const startTime = getFieldValue("startTime");

                  return (
                    <FormWrapper.Item
                      name="endTime"
                      label="Tugash vaqti"
                      dependencies={["startTime"]}
                      rules={[
                        { required: true, message: "Vaqtni tanlang" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const start = getFieldValue("startTime");
                            if (!value || !start) return Promise.resolve();
                            if (value.isAfter(start)) return Promise.resolve();
                            return Promise.reject(
                              new Error(
                                "Tugash vaqti boshlanishdan keyin bo'lishi kerak",
                              ),
                            );
                          },
                        }),
                      ]}
                    >
                      <TimePicker
                        format="HH:mm"
                        className="w-full"
                        hideDisabledOptions
                        disabledTime={() => {
                          const baseDisabled = [
                            ...Array.from({ length: 8 }, (_, i) => i),
                            ...Array.from({ length: 3 }, (_, i) => i + 21),
                          ];

                          if (!startTime) {
                            return { disabledHours: () => baseDisabled };
                          }

                          const startHour = startTime.hour();

                          return {
                            disabledHours: () => [
                              ...baseDisabled,
                              ...Array.from(
                                { length: startHour },
                                (_, i) => i,
                              ),
                            ],
                          };
                        }}
                      />
                    </FormWrapper.Item>
                  );
                }}
              </FormWrapper.Item>
            </div>

            {/* ✅ mode="multiple" — bir nechta kun tanlash imkoni */}
            <FormWrapper.Item
              name="weekDays"
              label="Kunlar"
              rules={[
                { required: true, message: "Kamida bitta kun tanlang" },
                {
                  type: "array",
                  min: 1,
                  message: "Kamida bitta kun tanlang",
                },
              ]}
            >
              <SelectComponent
                mode="multiple"
                placeholder="Kunlarni tanlang"
                options={weekDaysOptions}
              />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="teacherId"
              label="O'qituvchi"
              rules={[{ required: true, message: "O'qituvchini tanlang" }]}
            >
              <SelectComponent
                placeholder="O'qituvchini tanlang"
                loading={teachersLoading}
                options={teachers.map((teacher) => ({
                  value: teacher.id,
                  label: teacher.fullName,
                }))}
              />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="categoryId"
              label="Kategoriya"
              rules={[{ required: true, message: "Kategoriyani tanlang" }]}
            >
              <SelectComponent
                placeholder="Kategoriyani tanlang"
                loading={categoryLoading}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="roomId"
              label="Xona"
              rules={[{ required: true, message: "Xonani tanlang" }]}
            >
              <SelectComponent
                placeholder="Xonani tanlang"
                loading={roomsLoading}
                options={rooms.map((room) => ({
                  value: room.id,
                  label: room.name,
                }))}
              />
            </FormWrapper.Item>
          </FormWrapper>
        </ModalComponent>
      </div>
    </div>
  );
};

export default Groups;