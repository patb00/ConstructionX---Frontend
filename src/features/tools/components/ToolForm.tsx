import { useTranslation } from "react-i18next";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import type { NewToolRequest } from "..";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { useToolCategoryOptions } from "../../constants/options/useToolCategoryOptions";
import { useToolStatusOptions } from "../../constants/options/useToolStatusOptions";
import { useToolConditionOptions } from "../../constants/options/useToolConditionOptions";

type Props = {
  defaultValues?: Partial<NewToolRequest>;
  onSubmit: (values: NewToolRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function ToolForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();

  const { options: categoryOptions, isLoading: categoriesLoading } =
    useToolCategoryOptions();

  const { options: employeeOptions, isLoading: employeesLoading } =
    useEmployeeOptions();

  const { options: statusOptions, isLoading: statusesLoading } =
    useToolStatusOptions();

  const { options: conditionOptions, isLoading: conditionsLoading } =
    useToolConditionOptions();

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
      options: employeeOptions,
    },
    { name: "description", label: t("tools.form.field.description") },
  ];

  const isBusy =
    busy ||
    categoriesLoading ||
    employeesLoading ||
    statusesLoading ||
    conditionsLoading;

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
      busy={isBusy}
      submitLabel={t("tools.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
