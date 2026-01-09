import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { NewToolRepairRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

import { useToolOptions } from "../../constants/options/useToolOptions";
import { useToolConditionOptions } from "../../constants/options/useToolConditionOptions";

type Props = {
  defaultValues?: Partial<NewToolRepairRequest>;
  onSubmit: (values: NewToolRepairRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function ToolRepairForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();

  const { options: toolOptions, isLoading: toolsLoading } = useToolOptions();
  const { options: conditionOptions, isLoading: conditionsLoading } =
    useToolConditionOptions();

  const fields: FieldConfig<NewToolRepairRequest>[] = useMemo(
    () => [
      {
        name: "toolId",
        label: t("toolRepairs.form.field.toolId"),
        type: "select",
        required: true,
        options: toolOptions,
        transformOut: (v) => Number(v),
      },
      {
        name: "repairDate",
        label: t("toolRepairs.form.field.repairDate"),
        type: "date",
        required: true,
      },
      {
        name: "cost",
        label: t("toolRepairs.form.field.cost"),
        type: "number",
        required: true,
        transformOut: (v) => Number(v),
      },
      {
        name: "condition",
        label: t("toolRepairs.form.field.condition"),
        type: "select",
        options: conditionOptions,
      },
      {
        name: "description",
        label: t("toolRepairs.form.field.description"),
        type: "textarea",
      },
    ],
    [t, toolOptions, conditionOptions]
  );

  const isBusy = busy || toolsLoading || conditionsLoading;

  return (
    <SmartForm<NewToolRepairRequest>
      fields={fields}
      rows={[
        ["toolId"],
        ["repairDate", "cost"],
        ["condition"],
        ["description"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("toolRepairs.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
