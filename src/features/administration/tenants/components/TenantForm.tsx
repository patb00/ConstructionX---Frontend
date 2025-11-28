import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewTenantRequest } from "..";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<NewTenantRequest>;
  onSubmit: (values: NewTenantRequest) => void | Promise<void>;
  busy?: boolean;

  // 🆕 logo file props
  selectedLogoFile?: File | null;
  onLogoFileChange?: (file: File | null) => void;
  logoFileAccept?: string;
};

function normalizeBackslashes(s: string) {
  return s.replace(/\\+/g, "\\");
}
function sanitizeConnectionString(s?: string | null): string | null {
  const trimmed = (s ?? "").trim();
  if (!trimmed) return null;
  return normalizeBackslashes(trimmed);
}

export default function TenantForm({
  defaultValues,
  onSubmit,
  busy,
  selectedLogoFile,
  onLogoFileChange,
  logoFileAccept = "image/*",
}: Props) {
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

    { name: "oib", label: t("tenants.form.field.oib") },
    { name: "vatNumber", label: t("tenants.form.field.vatNumber") },
    {
      name: "registrationNumber",
      label: t("tenants.form.field.registrationNumber"),
    },
    { name: "companyCode", label: t("tenants.form.field.companyCode") },
    {
      name: "contactPhone",
      label: t("tenants.form.field.contactPhone"),
      props: { inputProps: { inputMode: "tel" } },
    },
    {
      name: "websiteUrl",
      label: t("tenants.form.field.websiteUrl"),
    },
    { name: "addressStreet", label: t("tenants.form.field.addressStreet") },
    {
      name: "addressPostalCode",
      label: t("tenants.form.field.addressPostalCode"),
    },
    { name: "addressCity", label: t("tenants.form.field.addressCity") },
    { name: "addressState", label: t("tenants.form.field.addressState") },
    { name: "addressCountry", label: t("tenants.form.field.addressCountry") },

    // 🆕 logo file field (not part of NewTenantRequest, so cast as any)
    {
      name: "logo" as any,
      label: t("tenants.form.field.logo", { defaultValue: "Logo" }),
      type: "file",
      fileConfig: {
        file: selectedLogoFile ?? null,
        onChange: onLogoFileChange,
        accept: logoFileAccept,
      },
    } as any,
  ];

  return (
    <SmartForm<NewTenantRequest>
      fields={fields}
      rows={
        [
          ["identifier", "name"],
          ["connectionString"],
          ["email", "validUpToDate"],
          ["firstName", "lastName"],
          ["oib", "vatNumber"],
          ["registrationNumber", "companyCode"],
          ["contactPhone", "websiteUrl"],
          ["addressStreet"],
          ["addressPostalCode", "addressCity"],
          ["addressState", "addressCountry"],
          ["isActive"],
          ["logo" as any], // 🆕 logo row
        ] as any
      }
      defaultValues={{
        identifier: "",
        name: "",
        connectionString: defaultValues?.connectionString ?? "",
        email: "",
        firstName: "",
        lastName: "",
        validUpToDate: defaultValues?.validUpToDate ?? null,
        isActive: true,

        oib: "",
        vatNumber: "",
        registrationNumber: "",
        companyCode: "",
        contactPhone: "",
        websiteUrl: "",
        addressStreet: "",
        addressPostalCode: "",
        addressCity: "",
        addressState: "",
        addressCountry: "",

        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("tenants.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
