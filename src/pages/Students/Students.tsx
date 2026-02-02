import { useState } from "react";
import { Form, Input, ConfigProvider, theme as antdTheme } from "antd";
import ListHeader from "../../components/ListHeader/ListHeader";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useStudents } from "../../hooks/useStudent";
import { Student } from "../../types/student";
import { LoadingScreen } from "../../components/loading/Loading";

const Students = () => {
  const { theme } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = antdTheme;
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  const {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating,
  } = useStudents();

  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (s) =>
          s.fulName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.phoneNumber.includes(searchTerm)
      )
    : [];

  // MODAL SHOW
  const showModal = (student: Student | null = null) => {
    setEditingStudent(student);
    if (student) {
      // When editing, map API fields to form fields
      form.setFieldsValue({
        fulName: student.fulName,
        phoneNumber: student.phoneNumber,
        groupId: student.groupId,
        imgUrl: student.imgUrl,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // MODAL SAVE
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingStudent) {
        // UPDATE - map form fields to API DTO
        const updateData = {
          id: editingStudent.id,
          fullName: values.fulName, // fulName -> fullName
          phone: values.phoneNumber, // phoneNumber -> phone
          imgUrl: values.imgUrl || "",
        };

        updateStudent(updateData);
      } else {
        // CREATE - map form fields to API DTO
        const createData = {
          fullName: values.fulName, // fulName -> fullName
          phone: values.phoneNumber, // phoneNumber -> phone
          imgUrl: values.imgUrl || "",
          password: values.password,
          groupId: Number(values.groupId),
          parentPhone: values.parentPhone,
          parentName: values.parentName,
        };

        createStudent(createData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error("Form validation error:", err);
    }
  };

  if (loading) return <LoadingScreen/>;
  if (error) return <p className="text-red-500">{error}</p>;

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
      <div className="p-4 bg-white dark:bg-gray-900">
        {/* HEADER */}
        <ListHeader
          title={t("studentsCount")}
          count={filteredStudents.length}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("searchStudent")}
          buttonText={t("addStudent")}
          onButtonClick={() => showModal()}
        />

        {/* TABLE */}
        <TableComponent<Student>
          data={filteredStudents}
          itemName={t("student")}
          searchKeys={["fulName", "groupName", "phoneNumber"]}
          columnsConfig={[
            {
              key: "student",
              title: t("student"),
              render: (record: Student) => (
                <div className="flex items-center gap-3">

                  <div>
                    <div className="font-medium">{record.fulName}</div>
                    <div className="text-xs text-gray-500">
                      {record.phoneNumber}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "group",
              title: t("group"),
              render: (record: Student) => record.groupName,
            },
            {
              key: "phone",
              title: t("phone"),
              render: (record: Student) => record.phoneNumber,
            },
          ]}
          modalFields={[
            {
              name: "fulName",
              label: t("full_name"),
              component: <Input />,
              rules: [{ required: true, message: "Please enter full name" }],
            },
            {
              name: "phoneNumber",
              label: t("phone"),
              component: <Input />,
              rules: [
                { required: true, message: "Please enter phone number" },
              ],
            },
            {
              name: "groupId",
              label: t("group"),
              component: <Input type="number" />,
              rules: [{ required: true, message: "Please enter group ID" }],
            },
            {
              name: "imgUrl",
              label: t("image"),
              component: <Input placeholder="Image URL (optional)" />,
            },
          ]}
          onEdit={(student: Student) => showModal(student)}
          onDelete={(student: Student) => deleteStudent(student.id)}
        />

        {/* MODAL */}
        <ModalComponent
          open={isModalVisible}
          title={editingStudent ? t("editStudent") : t("addStudent")}
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          okText={t("save")}
          cancelText={t("cancel")}
          confirmLoading={isCreating || isUpdating}
        >
          <Form form={form} layout="vertical">
            {/* COMMON FIELDS */}
            <Form.Item
              name="fulName"
              label={t("full_name")}
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={t("phone")}
              rules={[
                { required: true, message: "Please enter phone number" },
              ]}
            >
              <Input placeholder="998901234567" />
            </Form.Item>

            <Form.Item
              name="groupId"
              label={t("group")}
              rules={[{ required: true, message: "Please select group" }]}
            >
              <Input type="number" placeholder="Enter group ID" />
            </Form.Item>

            <Form.Item name="imgUrl" label={t("image")}>
              <Input placeholder="Image URL (optional)" />
            </Form.Item>

            {/* CREATE-ONLY FIELDS */}
            {!editingStudent && (
              <>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter password" },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                  name="parentName"
                  label="Parent Name"
                  rules={[
                    { required: true, message: "Please enter parent name" },
                  ]}
                >
                  <Input placeholder="Enter parent name" />
                </Form.Item>

                <Form.Item
                  name="parentPhone"
                  label="Parent Phone"
                  rules={[
                    { required: true, message: "Please enter parent phone" },
                  ]}
                >
                  <Input placeholder="998901234567" />
                </Form.Item>
              </>
            )}
          </Form>
        </ModalComponent>
      </div>
    </ConfigProvider>
  );
};

export default Students;