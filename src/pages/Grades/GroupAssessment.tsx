import { useState } from "react";
import { Button, Tag } from "antd";
import { UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
import ModalComponent from "../../components/Modal/Modal";
import TableComponent from "../../components/Table/Table";
import FormWrapper from "../../components/FormWrapper/FormWrapper";
import { InputNumber, Select } from "antd";

interface Student {
  id: number;
  fullName: string;
  assessed?: boolean;
}

const SingleAssessment = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, fullName: "Ali Valiyev" },
    { id: 2, fullName: "Vali Aliyev" },
    { id: 3, fullName: "Hasan Husanov" },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = FormWrapper.useForm();

  const openModal = (student: Student) => {
    if (student.assessed) return; // 1 marta mumkin

    setSelectedStudent(student);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();

      if (!selectedStudent) return;

      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id
            ? { ...s, assessed: true }
            : s
        )
      );

      setIsModalOpen(false); // saqlangach yopiladi
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Baholash
      </h2>

      <TableComponent<Student>
        data={students}
        itemName="o'quvchilar"
        searchKeys={["fullName"]}
        columnsConfig={[
          {
            key: "index",
            title: "O‘rni",
            render: (_, __, index) => index + 1,
          },
          {
            key: "student",
            title: "Ismi Familiyasi",
            render: (record) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <UserOutlined />
                </div>
                <span className="font-semibold">
                  {record.fullName}
                </span>
              </div>
            ),
          },
          {
            key: "action",
            title: "Holat",
            render: (record) =>
              record.assessed ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Baholangan
                </Tag>
              ) : (
                <Button
                  type="primary"
                  onClick={() => openModal(record)}
                >
                  Baholash
                </Button>
              ),
          },
        ]}
      />

      <ModalComponent
        open={isModalOpen}
        title={`Baholash - ${selectedStudent?.fullName}`}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <FormWrapper form={form} layout="vertical">
          <div className="grid grid-cols-3 gap-4">
            <FormWrapper.Item
              name="totalScore"
              label="Umumiy ball"
              rules={[{ required: true, message: "Ball kiriting" }]}
            >
              <InputNumber min={0} max={100} className="w-full" />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="activityScore"
              label="Faollik"
              rules={[{ required: true, message: "Ball kiriting" }]}
            >
              <InputNumber min={0} max={100} className="w-full" />
            </FormWrapper.Item>

            <FormWrapper.Item
              name="homeworkScore"
              label="Uy ishi"
              rules={[{ required: true, message: "Ball kiriting" }]}
            >
              <InputNumber min={0} max={100} className="w-full" />
            </FormWrapper.Item>
          </div>

          <FormWrapper.Item
            name="markStatus"
            label="Baho turi"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="KUNLIK_BAHO">
                Kunlik
              </Select.Option>
              <Select.Option value="IMTIHON_BAHO">
                Imtihon
              </Select.Option>
            </Select>
          </FormWrapper.Item>

          <FormWrapper.Item
            name="markCategoryStatus"
            label="Daraja"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="YASHIL">
                <Tag color="green">A'lo</Tag>
              </Select.Option>
              <Select.Option value="SARIQ">
                <Tag color="gold">Yaxshi</Tag>
              </Select.Option>
              <Select.Option value="QIZIL">
                <Tag color="red">Qoniqarsiz</Tag>
              </Select.Option>
            </Select>
          </FormWrapper.Item>
        </FormWrapper>
      </ModalComponent>
    </div>
  );
};

export default SingleAssessment;