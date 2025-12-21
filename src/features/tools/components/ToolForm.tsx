import { useTranslation } from "react-i18next";
import type { NewToolRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewToolRequest>;
  onSubmit: (values: NewToolRequest) => void | Promise<void>;
  busy?: boolean;
  categoryOptions: Option[];
  employeeOptions: Option[];
  statusOptions: Option[];
  conditionOptions: Option[];
};

export default function ToolForm({
  defaultValues,
  onSubmit,
  busy,
  categoryOptions,
  employeeOptions,
  statusOptions,
  conditionOptions,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewToolRequest>[] = [
    { name: "name", label: t("tools.form.field.name"), required: true },
    { name: "inventoryNumber", label: t("tools.form.field.inventoryNumber") },
    { name: "serialNumber", label: t("tools.form.field.serialNumber") },
    { name: "manufacturer", label: t("tools.form.field.manufacturer") },
    { name: "model", label: t("tools.form.field.model") },
    {
      name: "purchaseDate",
      label: t("tools.form.field.purchaseDate"),
      type: "date",
      required: true,
    },
    {
      name: "purchasePrice",
      label: t("tools.form.field.purchasePrice"),
      type: "number",
      required: true,
    },

    {
      name: "status",
      label: t("tools.form.field.status"),
      type: "select",
      options: statusOptions,
    },
    {
      name: "condition",
      label: t("tools.form.field.condition"),
      type: "select",
      options: conditionOptions,
    },
    {
      name: "toolCategoryId",
      label: t("tools.form.field.toolCategoryId"),
      type: "select",
      required: true,
      options: categoryOptions,
    },
    {
      name: "responsibleEmployeeId",
      label: t("tools.form.field.responsibleEmployeeId"),
      type: "select",
      required: false,
      options: employeeOptions,
    },
    { name: "description", label: t("tools.form.field.description") },
  ];

  return (
    <SmartForm<NewToolRequest>
      fields={fields}
      rows={[
        ["name", "toolCategoryId"],
        ["inventoryNumber", "serialNumber"],
        ["manufacturer", "model"],
        ["purchaseDate", "purchasePrice"],
        ["status", "condition"],
        ["responsibleEmployeeId", "description"],
      ]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("tools.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
