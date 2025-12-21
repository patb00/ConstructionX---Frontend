import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewJobPositionRequest } from "..";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<NewJobPositionRequest>;
  onSubmit: (values: NewJobPositionRequest) => void;
  busy?: boolean;
};

export default function JobPositionForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewJobPositionRequest>[] = [
    { name: "name", label: t("jobPositions.form.field.name"), required: true },
    { name: "description", label: t("jobPositions.form.field.description") },
  ];

  return (
    <SmartForm<NewJobPositionRequest>
      fields={fields}
      rows={[["name", "description"]]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("jobPositions.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
