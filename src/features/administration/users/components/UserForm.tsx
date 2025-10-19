import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { RegisterUserRequest } from "..";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<RegisterUserRequest>;
  onSubmit: (values: RegisterUserRequest) => void;
  busy?: boolean;
};

export default function UserForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<RegisterUserRequest>[] = [
    {
      name: "firstName",
      label: t("users.form.field.firstName"),
      required: true,
    },
    { name: "lastName", label: t("users.form.field.lastName"), required: true },
    {
      name: "email",
      label: t("users.form.field.email"),
      type: "email",
      required: true,
    },
    { name: "phoneNumber", label: t("users.form.field.phoneNumber") },
    {
      name: "password",
      label: t("users.form.field.password"),
      type: "password",
      required: true,
    },
    {
      name: "confirmPassword",
      label: t("users.form.field.confirmPassword"),
      type: "password",
      required: true,
    },
    {
      name: "isActive",
      label: t("users.form.field.isActive"),
      type: "checkbox",
    },
  ];

  return (
    <SmartForm<RegisterUserRequest>
      fields={fields}
      rows={[
        ["firstName", "lastName"],
        ["email", "phoneNumber"],
        ["password", "confirmPassword"],
        ["isActive"],
      ]}
      defaultValues={{
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        isActive: true,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("users.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
