import { Spin, Form, InputNumber, Select } from "antd";
import { useGroups, useGroupDetails } from "../../hooks/useGroups";
import NotFoundData from "../OtherPage/NotFoundData";
import ListHeader from "../../components/ListHeader/ListHeader";
import { useEffect, useState } from "react";
import TableComponent from "../../components/Table/Table";
import ModalComponent from "../../components/Modal/Modal";
import IconButton from "../../components/IconButton/IconButton";
import { TrophyOutlined, BookOutlined } from "@ant-design/icons";
import { useMarks } from "../../hooks/useMark";

const Assessment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [markStatus, setMarkStatus] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { groups, loading: groupsLoading } = useGroups();
  const { students, loading: studentsLoading } = useGroupDetails(selectedGroupId ?? 0);
  const { createMark, isCreating } = useMarks();

  useEffect(() => {
    if (groups && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups]);

  const filteredStudents = students.filter(
    (s) =>
      s.fulName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phoneNumber.includes(searchTerm),
  );

  const handleOpenModal = (student: any) => {
    setSelectedStudent(student);
    setMarkStatus(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setMarkStatus(null);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    createMark(
      { studentId: selectedStudent.id, ...values },
      { onSuccess: handleClose },
    );
  };

  if (groupsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <NotFoundData
        title="Guruhlar topilmadi"
        description="Hozircha hech qanday guruh mavjud emas"
      />
    );
  }

  return (
    <div>
      <ListHeader
        title="O'quvchilar"
        count={filteredStudents.length}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectOption={groups.map((g) => ({
          value: g.id,
          label: g.name,
        }))}
        onSelectChange={(val: number) => {
          setSelectedGroupId(val);
          setSearchTerm("");
        }}
        selectValue={selectedGroupId ?? undefined}
        searchPlaceholder="O'quvchi qidirish..."
      />

      {selectedGroupId ? (
        studentsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <TableComponent
            data={filteredStudents.map((s) => ({ ...s, id: s.id }))}
            columnsConfig={[
              { title: "F.I.O", key: "fulName" },
              { title: "Telefon raqam", key: "phoneNumber" },
              { title: "Ota-ona", key: "parentName" },
              {
                title: "Baholash",
                key: "id",
                render: (_: any, record: any) => (
                  <IconButton
                    text="Baholash"
                    onClick={() => handleOpenModal(record)}
                  />
                ),
              },
            ]}
            itemName="O'quvchi"
            pagination={{ pageSize: 10 }}
          />
        )
      ) : (
        <div className="flex justify-center items-center py-20 text-gray-400">
          Guruhni tanlang
        </div>
      )}

      <ModalComponent
        open={isModalVisible}
        title={
          <div className="flex items-center gap-2">
            <span>{selectedStudent?.fulName} — baho qo'shish</span>
          </div>
        }
        onOk={handleSave}
        onCancel={handleClose}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={isCreating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="markStatus"
            label="Baho turi"
            rules={[{ required: true, message: "Baho turini tanlang" }]}
          >
            <Select
              placeholder="Baho turini tanlang"
              onChange={(val) => {
                setMarkStatus(val);
                form.resetFields(["totalScore", "activityScore", "homeworkScore"]);
              }}
            >
              <Select.Option value="KUNLIK_BAHO">
                <BookOutlined /> Kunlik baho
              </Select.Option>
              <Select.Option value="IMTIHON_BAHO">
                <TrophyOutlined /> Imtihon bahosi
              </Select.Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="totalScore"
              label="Umumiy ball"
              rules={[
                { required: markStatus === "IMTIHON_BAHO", message: "Umumiy ballni kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
                disabled={markStatus !== "IMTIHON_BAHO"}
              />
            </Form.Item>

            <Form.Item
              name="activityScore"
              label="Faollik bali"
              rules={[
                { required: markStatus === "KUNLIK_BAHO", message: "Faollik balini kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
                disabled={markStatus !== "KUNLIK_BAHO"}
              />
            </Form.Item>

            <Form.Item
              name="homeworkScore"
              label="Uy ishi bali"
              rules={[
                { required: markStatus === "KUNLIK_BAHO", message: "Uy ishi balini kiriting" },
                { type: "number", min: 0, max: 100, message: "0-100 oralig'ida" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                placeholder="0"
                disabled={markStatus !== "KUNLIK_BAHO"}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Assessment;