import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { RegisterUserRequest } from "..";

type Props = {
  defaultValues?: Partial<RegisterUserRequest>;
  onSubmit: (values: RegisterUserRequest) => void;
  busy?: boolean;
};

export default function UserForm({ defaultValues, onSubmit, busy }: Props) {
  const fields: FieldConfig<RegisterUserRequest>[] = [
    { name: "firstName", label: "First name", required: true },
    { name: "lastName", label: "Last name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phoneNumber", label: "Phone number" },
    { name: "password", label: "Password", type: "password", required: true },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: "password",
      required: true,
    },
    { name: "isActive", label: "Active", type: "checkbox" },
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
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
