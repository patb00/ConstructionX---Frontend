import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewCompanyRequest } from "..";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<NewCompanyRequest>;
  onSubmit: (values: NewCompanyRequest) => void;
  busy?: boolean;
};

export default function CompanyForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewCompanyRequest>[] = [
    { name: "name", label: t("companies.form.field.name"), required: true },
    {
      name: "dateOfCreation",
      label: t("companies.form.field.dateOfCreation"),
      type: "datetime-local",
    },
  ];

  return (
    <SmartForm<NewCompanyRequest>
      fields={fields}
      rows={[["name", "dateOfCreation"]]}
      defaultValues={{
        name: "",
        dateOfCreation: defaultValues?.dateOfCreation,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("companies.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
