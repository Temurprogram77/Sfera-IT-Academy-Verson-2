import { useState } from "react";
import { Form, Input, Popconfirm, Select, Spin, TimePicker, Tag } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { useGroups } from "../../hooks/useGroups";
import { Group, WeekDay } from "../../types/group";
import { PencilIcon, TrashBinIcon } from "../../icons";
import NotFoundData from "../OtherPage/NotFoundData";
import dayjs from "dayjs";
import {
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Groups = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form] = Form.useForm();

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

  const weekDaysOptions = [
    { value: WeekDay.MONDAY, label: t("monday"), color: "blue" },
    { value: WeekDay.TUESDAY, label: t("tuesday"), color: "green" },
    { value: WeekDay.WEDNESDAY, label: t("wednesday"), color: "orange" },
    { value: WeekDay.THURSDAY, label: t("thursday"), color: "purple" },
    { value: WeekDay.FRIDAY, label: t("friday"), color: "cyan" },
    { value: WeekDay.SATURDAY, label: t("saturday"), color: "magenta" },
    { value: WeekDay.SUNDAY, label: t("sunday"), color: "red" },
  ];

  const getWeekDayColor = (day: string) => {
    const option = weekDaysOptions.find((opt) => opt.value === day);
    return option?.color || "default";
  };

  const getWeekDayLabel = (day: string) => {
    const option = weekDaysOptions.find((opt) => opt.value === day);
    return option?.label || day;
  };

  // Modal functions
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingGroup(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (group: any) => {
    setIsEditMode(true);
    setEditingGroup(group);
    form.setFieldsValue({
      name: group.name,
      startTime: group.startTime ? dayjs(group.startTime, "HH:mm") : null,
      endTime: group.endTime ? dayjs(group.endTime, "HH:mm") : null,
      weekDays: group.weekDays || [],
      teacherId: group.teacherId,
      categoryId: group.categoryId,
      roomId: group.roomId,
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const groupData = {
        name: values.name,
        startTime: values.startTime ? values.startTime.format("HH:mm") : "",
        endTime: values.endTime ? values.endTime.format("HH:mm") : "",
        weekDays: values.weekDays || [],
        teacherId: values.teacherId,
        categoryId: values.categoryId,
        roomId: values.roomId,
      };

      if (isEditMode && editingGroup) {
        updateGroup(
          {
            id: editingGroup.id,
            ...groupData,
          },
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

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page - 1);
    setPageSize(pageSize);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ListHeader
          title={t("groupsCount")}
          count={groups.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("searchGroup")}
          buttonText={t("addGroup")}
          onButtonClick={openAddModal}
        />

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Guruhlar yuklanmoqda...
              </p>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <NotFoundData
            title="Guruhlar topilmadi"
            description="Hozircha hech qanday guruh qo'shilmagan. Yangi guruh qo'shish uchun yuqoridagi tugmani bosing."
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <TableComponent<Group>
              data={groups}
              itemName={t("groups")}
              searchKeys={["name", "teacherName", "categoryName"]}
              columnsConfig={[
                {
                  key: "group",
                  title: t("group"),
                  render: (record) => (
                    <div className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {record.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-base">
                            {record.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <TeamOutlined className="text-gray-400 text-xs" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {record.studentCount} {t("unit")} {t("student").toLowerCase()}
                            </span>
                          </div>
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
                      {record.teacherName ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold shadow">
                            {record.teacherName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {record.teacherName}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <UserOutlined />
                          <span className="text-sm">
                            {t("teacherNotAssigned")}
                          </span>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: "category",
                  title: t("category"),
                  render: (record) => (
                    <div>
                      <Tag
                        color="blue"
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        icon={<BookOutlined />}
                      >
                        {record.categoryName}
                      </Tag>
                    </div>
                  ),
                },
                {
                  key: "students",
                  title: t("students"),
                  render: (record) => (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <TeamOutlined className="text-blue-600 dark:text-blue-400 text-lg" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {record.studentCount}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("students")}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "actions",
                  title: t("actions"),
                  render: (record) => (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(record)}
                        disabled={isUpdating}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 disabled:opacity-50"
                      >
                        <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-700 dark:text-blue-400" />
                      </button>
                      <Popconfirm
                        title={t("deleteGroup")}
                        description={`"${record.name}" ${t("confirmDeleteGroup")}`}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t("yes")}
                        cancelText={t("no")}
                        okButtonProps={{ loading: isDeleting, danger: true }}
                      >
                        <button
                          disabled={isDeleting}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 disabled:opacity-50"
                        >
                          <TrashBinIcon className="w-5 h-5 text-red-600 hover:text-red-700 dark:text-red-400" />
                        </button>
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
                showTotal: (total) => (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("total")}:{" "}
                    <span className="font-bold text-blue-600">{total} </span>
                    <span className="font-bold text-blue-600"> {t("unit")} </span>
                     {t("group").toLowerCase()}
                  </span>
                ),
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
            />
          </div>
        )}

        <ModalComponent
          open={isModalVisible}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <TeamOutlined className="text-white text-lg" />
              </div>
              <span className="text-xl font-semibold">
                {isEditMode ? t("editGroup") : t("addNewGroup")}
              </span>
            </div>
          }
          onOk={handleSave}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          okText={t("save")}
          cancelText={t("cancel")}
          confirmLoading={isCreating || isUpdating}
          width={700}
        >
          <Form form={form} layout="vertical" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label={
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("groupName")}
                  </span>
                }
                rules={[
                  { required: true, message: t("enterGroupName") },
                  { min: 2, message: "Kamida 2 ta belgi kiriting" },
                ]}
                className="mb-0"
              >
                <Input
                  size="large"
                  placeholder={t("groupNameExample")}
                  prefix={<TeamOutlined className="text-gray-400" />}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="categoryId"
                label={
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("courseDirection")}
                  </span>
                }
                rules={[{ required: true, message: t("selectCourse") }]}
                className="mb-0"
              >
                <Select
                  size="large"
                  placeholder={t("selectCourse")}
                  className="rounded-lg"
                  suffixIcon={<BookOutlined className="text-gray-400" />}
                >
                  <Option value={1}>{t("frontend")}</Option>
                  <Option value={2}>{t("backend")}</Option>
                  <Option value={3}>{t("mobile")}</Option>
                  <Option value={4}>{t("design")}</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Form.Item
                name="teacherId"
                label={
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("teacher")}
                  </span>
                }
                rules={[{ required: true, message: t("selectTeacher") }]}
                className="mb-0"
              >
                <Select
                  size="large"
                  placeholder={t("selectTeacher")}
                  className="rounded-lg"
                  suffixIcon={<UserOutlined className="text-gray-400" />}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Option value={1}>{t("teacherSardorbek")}</Option>
                  <Option value={2}>{t("teacherJavohir")}</Option>
                  <Option value={3}>{t("teacherDilshod")}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="roomId"
                label={
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("room")}
                  </span>
                }
                rules={[{ required: true, message: "Xonani tanlang" }]}
                className="mb-0"
              >
                <Select
                  size="large"
                  placeholder="Xonani tanlang"
                  className="rounded-lg"
                  suffixIcon={<HomeOutlined className="text-gray-400" />}
                >
                  <Option value={1}>101-{t("room").toLowerCase()}</Option>
                  <Option value={2}>102-{t("room").toLowerCase()}</Option>
                  <Option value={3}>103-{t("room").toLowerCase()}</Option>
                  <Option value={4}>201-{t("room").toLowerCase()}</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Form.Item
                name="startTime"
                label={
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("startTime")}
                  </span>
                }
                rules={[{ required: true, message: t("enterStartTime") }]}
                className="mb-0"
              >
                <TimePicker
                  size="large"
                  format="HH:mm"
                  placeholder="09:00"
                  className="w-full rounded-lg"
                  suffixIcon={<ClockCircleOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label={
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("endTime")}
                  </span>
                }
                rules={[
                  { required: true, message: t("enterEndTime") },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startTime = getFieldValue("startTime");
                      if (!value || !startTime) {
                        return Promise.resolve();
                      }
                      if (value.isAfter(startTime)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("endTimeMustBeAfterStartTime")),
                      );
                    },
                  }),
                ]}
                className="mb-0"
              >
                <TimePicker
                  size="large"
                  format="HH:mm"
                  placeholder="12:00"
                  className="w-full rounded-lg"
                  suffixIcon={<ClockCircleOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="weekDays"
              label={
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CalendarOutlined />
                  {t("lessonDays")}
                </span>
              }
              rules={[{ required: true, message: t("selectAtLeastOneDay") }]}
              className="mt-4"
            >
              <Select
                mode="multiple"
                size="large"
                placeholder={t("selectAtLeastOneDay")}
                className="rounded-lg"
                maxTagCount="responsive"
                tagRender={(props) => {
                  const { label, value } = props;
                  return (
                    <Tag
                      color={getWeekDayColor(value as string)}
                      closable
                      onClose={props.onClose}
                      className="px-3 py-1 m-1 rounded-full"
                    >
                      {getWeekDayLabel(value as string)}
                    </Tag>
                  );
                }}
              >
                {weekDaysOptions.map((day) => (
                  <Option key={day.value} value={day.value}>
                    <Tag color={day.color} className="rounded-full px-3">
                      {day.label}
                    </Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">{t("noteTitle")}</p>
                  <p>{t("noteContent")}</p>
                </div>
              </div>
            </div>
          </Form>
        </ModalComponent>
      </div>
    </div>
  );
};

export default Groups;
