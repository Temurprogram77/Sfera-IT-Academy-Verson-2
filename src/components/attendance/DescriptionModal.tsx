import { Modal, Button, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import ModalComponent from "../Modal/Modal";

// ─── Status selector (confirm modal) ─────────────────────────────────────────

interface StatusSelectorOptions {
  studentId: number;
  date: Dayjs;
  onKeldi: (studentId: number, date: Dayjs) => void;
  onAbsent: (studentId: number, date: Dayjs, status: "KELMADI" | "SABABLI") => void;
}

export const openStatusSelector = ({
  studentId,
  date,
  onKeldi,
  onAbsent,
}: StatusSelectorOptions) => {
  Modal.confirm({
    title: "Davomatni tanlang",
    icon: <ExclamationCircleFilled />,
    content: (
      <div className="flex gap-2 mt-4">
        <Button
          type="primary"
          onClick={() => { Modal.destroyAll(); onKeldi(studentId, date); }}
        >
          Keldi
        </Button>
        <Button
          danger
          onClick={() => { Modal.destroyAll(); onAbsent(studentId, date, "KELMADI"); }}
        >
          Kelmadi
        </Button>
        <Button
          onClick={() => { Modal.destroyAll(); onAbsent(studentId, date, "SABABLI"); }}
        >
          Sababli
        </Button>
      </div>
    ),
    footer: null,
  });
};

// ─── Description modal ────────────────────────────────────────────────────────

interface DescriptionModalProps {
  open: boolean;
  description: string;
  onDescriptionChange: (val: string) => void;
  onOk: () => void;
  onCancel: () => void;
}

const DescriptionModal = ({
  open,
  description,
  onDescriptionChange,
  onOk,
  onCancel,
}: DescriptionModalProps) => (
  <ModalComponent
    open={open}
    title="Sababni kiriting"
    onOk={onOk}
    onCancel={onCancel}
    okText="Saqlash"
    cancelText="Bekor qilish"
  >
    <Input.TextArea
      rows={4}
      value={description}
      onChange={(e) => onDescriptionChange(e.target.value)}
      placeholder="Sabab kiriting..."
    />
  </ModalComponent>
);

export default DescriptionModal;