import type { NewExaminationTypeRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<NewExaminationTypeRequest>;
  onSubmit: (values: NewExaminationTypeRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function ExaminationTypeForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewExaminationTypeRequest>[] = [
    {
      name: "examinationTypeName",
      label: t("examinationTypes.form.field.examinationTypeName"),
      required: true,
    },
    {
      name: "monthsToNextExamination",
      label: t("examinationTypes.form.field.monthsToNextExamination"),
      type: "number",
      required: true,
    },
  ];

  return (
    <SmartForm<NewExaminationTypeRequest>
      fields={fields}
      rows={[["examinationTypeName", "monthsToNextExamination"]]}
      defaultValues={{
        examinationTypeName: "",
        monthsToNextExamination: 0,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("examinationTypes.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
