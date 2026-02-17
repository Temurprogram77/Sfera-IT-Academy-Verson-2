// components/Event/EventFormView.tsx
import React from "react";
import { IEventFormValues } from "../../types/event";
import FormWrapper from "../FormWrapper/FormWrapper";
import InputComponent from "../Input/Input";
import SelectComponent from "../Select/Select";

interface GroupOption {
  id: number;
  groupName?: string;
  name?: string;
}

interface EventFormViewProps {
  formValues: IEventFormValues;
  onChange: (values: IEventFormValues) => void;
  groups: GroupOption[] | undefined;
  groupsLoading: boolean;
}

const EventFormView: React.FC<EventFormViewProps> = ({
  formValues,
  onChange,
  groups,
  groupsLoading,
}) => {
  const set = (partial: Partial<IEventFormValues>) =>
    onChange({ ...formValues, ...partial });

  return (
    <FormWrapper>
      {/* Event nomi */}
      <InputComponent
        label="Event nomi"
        value={formValues.name}
        onChange={(e) => set({ name: e.target.value })}
        placeholder="Masalan: Bayram"
      />

      {/* Tavsif */}
      <InputComponent
        label="Tavsif"
        value={formValues.description}
        onChange={(e) => set({ description: e.target.value })}
        placeholder="Event haqida batafsil ma'lumot..."
        variant="textarea"
      />

      {/* Vaqt — ikki ustun */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <InputComponent
          label="Boshlanish vaqti"
          value={formValues.startTime}
          onChange={(e) => set({ startTime: e.target.value })}
          placeholder="00:00"
        />
        <InputComponent
          label="Tugash vaqti"
          value={formValues.endTime}
          onChange={(e) => set({ endTime: e.target.value })}
          placeholder="23:59"
        />
      </div>

      {/* Guruhlar */}
      <SelectComponent
        value={formValues.groupIds}
        onChange={(value) => set({ groupIds: value as number[] })}
        options={groups?.map((g) => ({
          value: g.id,
          label: g.groupName || g.name || `Guruh ${g.id}`,
        }))}
        placeholder="Guruhlarni tanlang"
        mode="multiple"
        loading={groupsLoading}
      />
    </FormWrapper>
  );
};

export default EventFormView;