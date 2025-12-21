import type { ConstructionSiteFormValues } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<ConstructionSiteFormValues>;
  onSubmit: (values: ConstructionSiteFormValues) => void | Promise<void>;
  busy?: boolean;
  managerOptions: Option[];
  statusOptions?: Option[];
  showStatus?: boolean;
};

export default function ConstructionSiteForm({
  defaultValues,
  onSubmit,
  busy,
  managerOptions,
  statusOptions = [],
  showStatus = false,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<ConstructionSiteFormValues>[] = [
    {
      name: "name",
      label: t("constructionSites.form.field.name"),
      required: true,
    },
    {
      name: "location",
      label: t("constructionSites.form.field.location"),
      required: true,
    },
    {
      name: "startDate",
      label: t("constructionSites.form.field.startDate"),
      type: "date",
      required: true,
    },
    {
      name: "plannedEndDate",
      label: t("constructionSites.form.field.plannedEndDate"),
      type: "date",
      required: true,
    },

    ...(showStatus
      ? ([
          {
            name: "status",
            label: t("constructionSites.form.field.status"),
            type: "select",
            required: true,
            options: statusOptions,
          },
        ] as FieldConfig<ConstructionSiteFormValues>[])
      : []),

    {
      name: "siteManagerId",
      label: t("constructionSites.form.field.siteManagerId"),
      type: "select",
      options: managerOptions,
    },
    {
      name: "description",
      label: t("constructionSites.form.field.description"),
    },
  ];

  const rows = showStatus
    ? ([
        ["name", "location"],
        ["startDate", "plannedEndDate"],
        ["status", "siteManagerId"],
        ["description"],
      ] as any)
    : ([
        ["name", "location"],
        ["startDate", "plannedEndDate"],
        ["siteManagerId"],
        ["description"],
      ] as any);

  return (
    <SmartForm<ConstructionSiteFormValues>
      fields={fields}
      rows={rows}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("constructionSites.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
