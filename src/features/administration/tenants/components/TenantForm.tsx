import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewTenantRequest } from "..";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const fields: FieldConfig<NewTenantRequest>[] = [
    {
      name: "identifier",
      label: t("tenants.form.field.identifier"),
      required: true,
    },
    { name: "name", label: t("tenants.form.field.name"), required: true },
    {
      name: "connectionString",
      label: t("tenants.form.field.connectionString"),
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
    { name: "email", label: t("tenants.form.field.email"), type: "email" },
    {
      name: "validUpToDate",
      label: t("tenants.form.field.validUntil"),
      type: "datetime-local",
    },
    { name: "firstName", label: t("tenants.form.field.firstName") },
    { name: "lastName", label: t("tenants.form.field.lastName") },
    {
      name: "isActive",
      label: t("tenants.form.field.isActive"),
      type: "checkbox",
      defaultValue: true,
    },
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
      submitLabel={t("tenants.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
