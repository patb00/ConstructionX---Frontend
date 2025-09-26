import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewRoleRequest } from "..";

type Props = {
  defaultValues?: Partial<NewRoleRequest>;
  onSubmit: (values: NewRoleRequest) => void;
  busy?: boolean;
};

export default function RoleForm({ defaultValues, onSubmit, busy }: Props) {
  const fields: FieldConfig<NewRoleRequest>[] = [
    { name: "name", label: "Name", required: true },
    { name: "description", label: "Description", required: true },
  ];

  return (
    <SmartForm<NewRoleRequest>
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
