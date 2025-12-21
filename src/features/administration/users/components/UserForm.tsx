import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { RegisterUserRequest } from "..";
import { useTranslation } from "react-i18next";

type RoleOption = { label: string; value: string };

type Props = {
  defaultValues?: Partial<RegisterUserRequest>;
  onSubmit: (values: RegisterUserRequest) => void;
  busy?: boolean;
  roleOptions: RoleOption[];
};

export default function UserForm({
  defaultValues,
  onSubmit,
  busy,
  roleOptions,
}: Props) {
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
      name: "roleId",
      label: t("users.form.field.role"),
      type: "select",
      required: true,
      options: roleOptions,
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
        ["roleId"],
        ["isActive"],
      ]}
      defaultValues={{
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        roleId: "",
        isActive: true,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("users.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
