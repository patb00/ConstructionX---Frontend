import type { NewCertificationTypeRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<NewCertificationTypeRequest>;
  onSubmit: (values: NewCertificationTypeRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function CertificationTypeForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewCertificationTypeRequest>[] = [
    {
      name: "certificationTypeName",
      label: t("certificationTypes.form.field.certificationTypeName"),
      required: true,
    },
    {
      name: "requiresRenewal",
      label: t("certificationTypes.form.field.requiresRenewal"),
      type: "checkbox",
    },
    {
      name: "monthsToRenewal",
      label: t("certificationTypes.form.field.monthsToRenewal"),
      type: "number",
      required: true,
    },
  ];

  return (
    <SmartForm<NewCertificationTypeRequest>
      fields={fields}
      rows={[["certificationTypeName", "requiresRenewal", "monthsToRenewal"]]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("certificationTypes.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
