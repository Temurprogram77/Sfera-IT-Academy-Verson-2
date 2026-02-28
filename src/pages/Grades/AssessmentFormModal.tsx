// components/AssessmentFormModal.tsx
import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Divider,
  Typography,
  Alert,
} from "antd";
import dayjs from "dayjs";
import type {
  Assessment,
  CreateAssessmentDto,
  UpdateAssessmentDto,
  MarkStatus,
} from "../../types/assessment";
import ScoreInput from "../../components/ScoreInput/ScoreInput";

const { Text } = Typography;
const { Option } = Select;

interface AssessmentFormModalProps {
  open: boolean;
  onClose: () => void;
  groupId: number | string;
  editData: Assessment | null;
  createStudentId: number | null;
  createStudentName: string;
  onCreate: (dto: CreateAssessmentDto) => Promise<unknown>;
  isCreating: boolean;
  onUpdate: (dto: UpdateAssessmentDto) => Promise<unknown>;
  isUpdating: boolean;
}

const AssessmentFormModal: React.FC<AssessmentFormModalProps> = ({
  open,
  onClose,
  editData,
  createStudentId,
  createStudentName,
  onCreate,
  isCreating,
  onUpdate,
  isUpdating,
}) => {
  const [form] = Form.useForm();
  const markStatus = Form.useWatch("markStatus", form);
  const isEdit = !!editData;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    if (editData) {
      form.setFieldsValue({
        markStatus: editData.markStatus,
        activityScore: editData.activityScore,
        homeworkScore: editData.homeworkScore,
        totalScore: editData.totalScore,
        date: editData.markDate ? dayjs(editData.markDate) : dayjs(),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        markStatus: "KUNLIK_BAHO",
        date: dayjs(),
      });
    }
  }, [open, editData, form]);

  const integer05Validator = (_: any, value: number) => {
    if (value === undefined || value === null)
      return Promise.reject(new Error("Qiymat kiriting"));
    if (!Number.isInteger(value))
      return Promise.reject(new Error("Faqat butun son"));
    if (value < 0 || value > 5)
      return Promise.reject(new Error("0 dan 5 gacha"));
    return Promise.resolve();
  };

  const blockInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const dateStr = dayjs(values.date).format("YYYY-MM-DD");
    const isImtihon = values.markStatus === "IMTIHON_BAHO";

    if (isEdit && editData) {
      const dto: UpdateAssessmentDto = {
        id: editData.markId,
        studentId: editData.studentId,
        markStatus: values.markStatus as MarkStatus,
        homeworkScore: isImtihon ? 0 : values.homeworkScore,
        activityScore: isImtihon ? 0 : values.activityScore,
        totalScore: isImtihon ? values.totalScore : 0,
        date: dateStr,
      };
      await onUpdate(dto);
    } else {
      if (!createStudentId) return;

      const dto: CreateAssessmentDto = {
        studentId: createStudentId,
        markStatus: values.markStatus as MarkStatus,
        homeworkScore: isImtihon ? 0 : values.homeworkScore,
        activityScore: isImtihon ? 0 : values.activityScore,
        totalScore: isImtihon ? values.totalScore : 0,
        date: dateStr,
      };
      await onCreate(dto);
    }

    onClose();
  };

  const studentDisplayName = isEdit ? editData?.studentName : createStudentName;

  return (
    <Modal
      title={isEdit ? "Bahoni tahrirlash" : "Yangi baho qo'shish"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnClose
    >
      <Divider />

      {studentDisplayName && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>O'quvchi: </Text>
          <Text>{studentDisplayName}</Text>
        </div>
      )}

      <Form form={form} layout="vertical" size="large">
        <Form.Item
          name="markStatus"
          label="Baho turi"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="KUNLIK_BAHO">Kunlik baho</Option>
            <Option value="IMTIHON_BAHO">Imtihon bahosi</Option>
          </Select>
        </Form.Item>

        {markStatus === "KUNLIK_BAHO" && (
          <>
            <Alert message="0-5 butun son kiriting" type="info" showIcon />

            <Form.Item
              name="activityScore"
              label="Faollik"
              rules={[
                { required: true, message: "Qiymat kiriting" },
                { validator: integer05Validator },
              ]}
            >
              <ScoreInput onKeyDown={blockInvalidKeys} />
            </Form.Item>

            <Form.Item
              name="homeworkScore"
              label="Uyga vazifa"
              rules={[
                { required: true, message: "Qiymat kiriting" },
                { validator: integer05Validator },
              ]}
            >
              <ScoreInput onKeyDown={blockInvalidKeys} />
            </Form.Item>
          </>
        )}

        {markStatus === "IMTIHON_BAHO" && (
          <Form.Item
            name="totalScore"
            label="Jami ball"
            rules={[{ required: true, message: "Qiymat kiriting" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        )}

        <Form.Item name="date" label="Sana" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />
        </Form.Item>

        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" loading={isLoading} onClick={handleSubmit}>
            {isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default AssessmentFormModal;