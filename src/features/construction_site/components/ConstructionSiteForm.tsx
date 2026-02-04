import type { ConstructionSiteFormValues } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";

import { useConstructionSiteManagerOptions } from "../../constants/options/useConstructionSiteManagerOptions";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<ConstructionSiteFormValues>;
  onSubmit: (values: ConstructionSiteFormValues) => void | Promise<void>;
  busy?: boolean;
  showStatus?: boolean;
  statusOptions?: Option[];
};

export default function ConstructionSiteForm({
  defaultValues,
  onSubmit,
  busy,
  showStatus = false,
  statusOptions,
}: Props) {
  const { t } = useTranslation();

  const { options: managerOptions, isLoading: managersLoading } =
    useConstructionSiteManagerOptions();

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

  const isBusy = busy || managersLoading;

  return (
    <SmartForm<ConstructionSiteFormValues>
      fields={fields}
      rows={rows}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("constructionSites.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
