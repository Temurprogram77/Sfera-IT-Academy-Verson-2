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
    <FormWrapper form={""}>
      {/* Event nomi */}
      <InputComponent
        label="Event nomi"
        value={formValues.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          set({ name: e.target.value })
        }
        placeholder="Masalan: Bayram"
      />

      {/* Tavsif */}
      <InputComponent
        label="Tavsif"
        value={formValues.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          set({ description: e.target.value })
        }
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set({ startTime: e.target.value })
          }
          placeholder="00:00"
        />
        <InputComponent
          label="Tugash vaqti"
          value={formValues.endTime}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            set({ endTime: e.target.value })
          }
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
        className="w-full mt-5! mb-3!"
        placeholder="Guruhlarni tanlang"
        mode="multiple"
        loading={groupsLoading}
      />
    </FormWrapper>
  );
};

export default EventFormView;
