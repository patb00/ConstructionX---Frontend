import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { NewRoleRequest } from "..";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<NewRoleRequest>;
  onSubmit: (values: NewRoleRequest) => void;
  busy?: boolean;
};

export default function RoleForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewRoleRequest>[] = [
    { name: "name", label: t("roles.form.field.name"), required: true },
    {
      name: "description",
      label: t("roles.form.field.description"),
      required: true,
      type: "textarea",
      props: { minRows: 5 },
    },
  ];

  return (
    <SmartForm<NewRoleRequest>
      fields={fields}
      rows={[["name"], ["description"]]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("roles.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
