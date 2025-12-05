import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { UpdateTenantRequest } from "..";
import { useTranslation } from "react-i18next";

export type TenantEditFormValues = Omit<UpdateTenantRequest, "id">;

type Props = {
  defaultValues?: Partial<TenantEditFormValues>;
  onSubmit: (values: TenantEditFormValues) => void | Promise<void>;
  busy?: boolean;
};

export default function TenantEditForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t, i18n } = useTranslation();

  const rawLang = i18n.language?.split("-")[0] ?? "en";
  const supported = ["en", "de", "hr"] as const;
  const currentLang = supported.includes(rawLang as any) ? rawLang : "en";

  const fields: FieldConfig<TenantEditFormValues>[] = [
    { name: "email", label: t("tenants.form.field.email"), type: "email" },
    { name: "firstName", label: t("tenants.form.field.firstName") },
    { name: "lastName", label: t("tenants.form.field.lastName") },
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
    {
      name: "notes",
      label: t("tenants.form.field.notes", { defaultValue: "Notes" }),
    },
  ];

  return (
    <SmartForm<TenantEditFormValues>
      fields={fields}
      rows={
        [
          ["email"],
          ["firstName", "lastName"],
          ["oib", "vatNumber"],
          ["registrationNumber", "companyCode"],
          ["contactPhone", "websiteUrl"],
          ["addressStreet"],
          ["addressPostalCode", "addressCity"],
          ["addressState", "addressCountry"],
          ["defaultLanguage"],
          ["notes"],
        ] as any
      }
      defaultValues={{
        email: "",
        firstName: "",
        lastName: "",
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
        defaultLanguage: currentLang,
        notes: "",
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("tenants.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
