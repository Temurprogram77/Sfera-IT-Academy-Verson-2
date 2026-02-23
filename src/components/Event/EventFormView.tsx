import { TimePicker } from "antd";
import SelectComponent from "../Select/Select";
import FormWrapper from "../FormWrapper/FormWrapper";
import InputComponent from "../Input/Input";
import type { FormInstance } from "antd";
import { IEventFormValues } from "../../types/event";
import dayjs, { Dayjs } from "dayjs";

interface EventFormViewProps {
  form: FormInstance;
  formValues: IEventFormValues;
  onChange: (values: IEventFormValues) => void;
  groups: any[];
  groupsLoading: boolean;
}

// ✅ 08:00 - 20:00 oralig'i uchun disabled soatlar
const getDisabledHours = () => {
  const hours: number[] = [];
  for (let i = 0; i < 8; i++) hours.push(i);
  for (let i = 21; i < 24; i++) hours.push(i);
  return hours;
};

// ✅ End time uchun disabled soatlar — start soatidan oldingilar
const getDisabledEndHours = (startTime: string) => {
  const hours: number[] = [];
  for (let i = 0; i < 8; i++) hours.push(i);
  for (let i = 21; i < 24; i++) hours.push(i);
  if (startTime) {
    const startHour = dayjs(startTime, "HH:mm").hour();
    for (let i = 8; i <= startHour; i++) hours.push(i);
  }
  return hours;
};

// ✅ End time uchun disabled minutelar — xuddi soat bo'lsa
const getDisabledEndMinutes = (startTime: string, selectedHour: number) => {
  if (!startTime) return [];
  const startHour = dayjs(startTime, "HH:mm").hour();
  const startMinute = dayjs(startTime, "HH:mm").minute();
  if (selectedHour === startHour + 0) {
    const minutes: number[] = [];
    for (let i = 0; i <= startMinute; i++) minutes.push(i);
    return minutes;
  }
  return [];
};

export default function EventFormView({
  form,
  formValues,
  onChange,
  groups,
  groupsLoading,
}: EventFormViewProps) {
  const groupOptions =
    groups?.map((g: any) => ({
      label: g.name || g.groupName,
      value: g.id,
    })) ?? [];

  // ✅ String → Dayjs (TimePicker uchun)
  const startDayjs: Dayjs | null = formValues.startTime
    ? dayjs(formValues.startTime, "HH:mm")
    : null;

  const endDayjs: Dayjs | null = formValues.endTime
    ? dayjs(formValues.endTime, "HH:mm")
    : null;

  const handleStartChange = (time: Dayjs | null) => {
    const val = time ? time.format("HH:mm") : "";
    // ✅ start o'zgarganda end ni reset
    onChange({ ...formValues, startTime: val, endTime: "" });
    form.setFieldsValue({ startTime: val, endTime: undefined });
  };


  const handleEndChange = (time: Dayjs | null) => {
    const val = time ? time.format("HH:mm") : "";
    onChange({ ...formValues, endTime: val });
    form.setFieldsValue({ endTime: val });
  };

  return (
    <FormWrapper form={form} layout="vertical">
      {/* ── Event nomi ── */}
      <FormWrapper.Item
        name="name"
        label="Event nomi"
        rules={[{ required: true, message: "Event nomini kiriting!" }]}
      >
        <InputComponent
          placeholder="Event nomini kiriting"
          value={formValues.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...formValues, name: e.target.value });
            form.setFieldValue("name", e.target.value);
          }}
        />
      </FormWrapper.Item>

      {/* ── Tavsif ── */}
      <FormWrapper.Item name="description" label="Tavsif">
        <InputComponent
          placeholder="Tavsif kiriting"
          value={formValues.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...formValues, description: e.target.value });
            form.setFieldValue("description", e.target.value);
          }}
        />
      </FormWrapper.Item>

      {/* ── Vaqtlar ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* ✅ startTime — Form.Item value string saqlaydi, lekin TimePicker dayjs ko'rsatadi */}
        <FormWrapper.Item
          name="startTime"
          label="Boshlanish vaqti"
          rules={[{ required: true, message: "Boshlanish vaqtini kiriting!" }]}
          // ✅ Form ichidagi value ni Dayjs ga aylantirmasin — getValueProps bilan
          getValueProps={() => ({ value: startDayjs })}
          normalize={(val: Dayjs | null) => (val ? val.format("HH:mm") : "")}
        >
          <TimePicker
            format="HH:mm"
            className="w-full"
            placeholder="08:00"
            value={startDayjs}
            onChange={handleStartChange}
            disabledTime={() => ({
              disabledHours: getDisabledHours,
            })}
            hideDisabledOptions
            needConfirm={false}
          />
        </FormWrapper.Item>

        {/* ✅ endTime */}
        <FormWrapper.Item
          name="endTime"
          label="Tugash vaqti"
          rules={[{ required: true, message: "Tugash vaqtini kiriting!" }]}
          getValueProps={() => ({ value: endDayjs })}
          normalize={(val: Dayjs | null) => (val ? val.format("HH:mm") : "")}
        >
          <TimePicker
            format="HH:mm"
            className="w-full"
            placeholder="20:00"
            value={endDayjs}
            onChange={handleEndChange}
            disabled={!formValues.startTime}
            disabledTime={() => ({
              disabledHours: () => getDisabledEndHours(formValues.startTime),
              disabledMinutes: (hour: number) =>
                getDisabledEndMinutes(formValues.startTime, hour),
            })}
            hideDisabledOptions
            needConfirm={false}
          />
        </FormWrapper.Item>
      </div>

      {/* ── Guruhlar ── */}
      <FormWrapper.Item name="groupIds" label="Guruhlar">
        <SelectComponent
          mode="multiple"
          allowClear
          className="w-full"
          placeholder="Guruhlarni tanlang"
          loading={groupsLoading}
          options={groupOptions}
          value={formValues.groupIds}
          onChange={(selected: number[]) => {
            onChange({ ...formValues, groupIds: selected });
            form.setFieldValue("groupIds", selected);
          }}
          filterOption={(input: string, option: any) =>
            String(option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          notFoundContent={
            groupsLoading ? "Yuklanmoqda..." : "Guruhlar topilmadi"
          }
        />
      </FormWrapper.Item>
    </FormWrapper>
  );
}
