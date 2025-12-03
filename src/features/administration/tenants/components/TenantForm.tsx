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
  const { t, i18n } = useTranslation();

  const rawLang = i18n.language?.split("-")[0] ?? "en";
  const supported = ["en", "de", "hr"] as const;
  const currentLang = supported.includes(rawLang as any) ? rawLang : "en";

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
    {
      name: "defaultLanguage",
      label: t("tenants.form.field.defaultLanguage", {
        defaultValue: "Default Language",
      }),
      type: "select",
      options: [
        { label: "English", value: "en" },
        { label: "Deutsch", value: "de" },
        { label: "Hrvatski", value: "hr" },
      ],
      defaultValue: currentLang,
    },
    {},
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
          ["defaultLanguage"],
          ["isActive"],
          ["logo" as any],
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
        defaultLanguage: defaultValues?.defaultLanguage ?? (currentLang as any),
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("tenants.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
