import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewCompanyRequest } from "..";

type Props = {
  defaultValues?: Partial<NewCompanyRequest>;
  onSubmit: (values: NewCompanyRequest) => void;
  busy?: boolean;
};

export default function CompanyForm({ defaultValues, onSubmit, busy }: Props) {
  const fields: FieldConfig<NewCompanyRequest>[] = [
    { name: "name", label: "Name", required: true },
    {
      name: "dateOfCreation",
      label: "Date of creation",
      type: "datetime-local",
    },
  ];

  return (
    <SmartForm<NewCompanyRequest>
      fields={fields}
      rows={[["name", "dateOfCreation"]]}
      defaultValues={{
        name: "",
        dateOfCreation: defaultValues?.dateOfCreation,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
