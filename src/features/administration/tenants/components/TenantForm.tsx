import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewTenantRequest } from "..";

type Props = {
  defaultValues?: Partial<NewTenantRequest>;
  onSubmit: (values: NewTenantRequest) => void;
  busy?: boolean;
};

function normalizeBackslashes(s: string) {
  return s.replace(/\\+/g, "\\");
}
function sanitizeConnectionString(s?: string | null): string | null {
  const trimmed = (s ?? "").trim();
  if (!trimmed) return null;
  return normalizeBackslashes(trimmed);
}

export default function TenantForm({ defaultValues, onSubmit, busy }: Props) {
  const fields: FieldConfig<NewTenantRequest>[] = [
    { name: "identifier", label: "Identifier", required: true },
    { name: "name", label: "Name", required: true },
    {
      name: "connectionString",
      label: "Connection String",
      defaultValue: "",
      props: {
        inputProps: {
          maxLength: 500,
          spellCheck: false,
          autoCapitalize: "off",
          autoCorrect: "off",
        },
      },
      transformOut: (v) => sanitizeConnectionString(v),
    },
    { name: "email", label: "Email", type: "email" },
    { name: "validUpToDate", label: "Valid Until", type: "datetime-local" },
    { name: "firstName", label: "First name" },
    { name: "lastName", label: "Last name" },
    { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
  ];

  return (
    <SmartForm<NewTenantRequest>
      fields={fields}
      rows={[
        ["identifier", "name"],
        ["connectionString"],
        ["email", "validUpToDate"],
        ["firstName", "lastName"],
        ["isActive"],
      ]}
      defaultValues={{
        identifier: "",
        name: "",
        connectionString: defaultValues?.connectionString ?? "",
        email: "",
        firstName: "",
        lastName: "",
        validUpToDate: defaultValues?.validUpToDate,
        isActive: true,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
