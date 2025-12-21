import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { NewTenantRequest, UpdateTenantRequest } from "..";
import { sanitizeConnectionString } from "../utils/tenantForm";

export type TenantFormMode = "create" | "edit";

type BaseTenantFields = Omit<UpdateTenantRequest, "id">;

type CreateExtraFields = Pick<
  NewTenantRequest,
  "identifier" | "name" | "connectionString" | "validUpToDate" | "isActive"
>;

export type TenantFormValues<M extends TenantFormMode> = M extends "create"
  ? BaseTenantFields & CreateExtraFields
  : BaseTenantFields;

type Props<M extends TenantFormMode> = {
  mode: M;
  defaultValues?: Partial<TenantFormValues<M>>;
  onSubmit: (values: TenantFormValues<M>) => void | Promise<void>;
  busy?: boolean;
  selectedLogoFile?: File | null;
  onLogoFileChange?: (file: File | null) => void;
  logoFileAccept?: string;
  existingLogoFileName?: string | null;
};

export default function TenantForm<M extends TenantFormMode>({
  mode,
  defaultValues,
  onSubmit,
  busy,
  selectedLogoFile,
  onLogoFileChange,
  logoFileAccept = "image/*",
  existingLogoFileName = null,
}: Props<M>) {
  const { t, i18n } = useTranslation();

  const rawLang = i18n.language?.split("-")[0] ?? "en";
  const supported = ["en", "de", "hr"] as const;
  const currentLang = supported.includes(rawLang as any) ? rawLang : "en";

  const sharedFields = useMemo<FieldConfig<any>[]>(() => {
    return [
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
      { name: "websiteUrl", label: t("tenants.form.field.websiteUrl") },

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

      {
        name: "logo" as any,
        label: t("tenants.form.field.logo", { defaultValue: "Logo" }),
        type: "file",
        fileConfig: {
          file: selectedLogoFile ?? null,
          onChange: onLogoFileChange,
          accept: logoFileAccept,
          existingFileName: existingLogoFileName,
        },
      } as any,
    ];
  }, [
    t,
    currentLang,
    selectedLogoFile,
    onLogoFileChange,
    logoFileAccept,
    existingLogoFileName,
  ]);

  const createOnlyFields = useMemo<FieldConfig<any>[]>(() => {
    if (mode !== "create") return [];

    return [
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
      {
        name: "validUpToDate",
        label: t("tenants.form.field.validUntil"),
        type: "datetime-local",
      },
      {
        name: "isActive",
        label: t("tenants.form.field.isActive"),
        type: "checkbox",
        defaultValue: true,
      },
    ];
  }, [mode, t]);

  const fields = useMemo(() => {
    return mode === "create"
      ? [...createOnlyFields, ...sharedFields]
      : [...sharedFields];
  }, [mode, createOnlyFields, sharedFields]);

  const rows = useMemo(() => {
    if (mode === "create") {
      return [
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
        ["notes"],
        ["logo" as any],
      ] as any;
    }

    return [
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
      ["logo" as any],
    ] as any;
  }, [mode]);

  return (
    <SmartForm<any>
      fields={fields as any}
      rows={rows}
      defaultValues={defaultValues as any}
      busy={busy}
      submitLabel={t("tenants.form.submit")}
      onSubmit={onSubmit as any}
    />
  );
}
