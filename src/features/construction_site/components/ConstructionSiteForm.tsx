import type { NewConstructionSiteRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewConstructionSiteRequest>;
  onSubmit: (values: NewConstructionSiteRequest) => void | Promise<void>;
  busy?: boolean;
  managerOptions: Option[];
};

export default function ConstructionSiteForm({
  defaultValues,
  onSubmit,
  busy,
  managerOptions,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewConstructionSiteRequest>[] = [
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
    {
      name: "siteManagerId",
      label: t("constructionSites.form.field.siteManagerId"),
      type: "select",
      required: false,
      options: managerOptions,
    },
    {
      name: "description",
      label: t("constructionSites.form.field.description"),
    },
  ];

  return (
    <SmartForm<NewConstructionSiteRequest>
      fields={fields}
      rows={[
        ["name", "location"],
        ["startDate", "plannedEndDate"],
        ["siteManagerId", "description"],
      ]}
      defaultValues={{
        name: "",
        location: "",
        startDate: "",
        plannedEndDate: "",
        siteManagerId: null,
        description: null,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("constructionSites.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
