import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewJobPositionRequest } from "..";

type Props = {
  defaultValues?: Partial<NewJobPositionRequest>;
  onSubmit: (values: NewJobPositionRequest) => void;
  busy?: boolean;
};

export default function JobPositionForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const fields: FieldConfig<NewJobPositionRequest>[] = [
    { name: "name", label: "Name", required: true },
    { name: "description", label: "Description", required: true },
  ];

  return (
    <SmartForm<NewJobPositionRequest>
      fields={fields}
      rows={[["name", "description"]]}
      defaultValues={{
        name: "",
        ...defaultValues,
      }}
      busy={busy}
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
