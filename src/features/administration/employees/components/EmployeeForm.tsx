import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { EmployeeFormValues } from "..";
import { useJobPositionOptions } from "../../../constants/options/useJobPositionOptions";
import { useTranslation } from "react-i18next";
import { useClothingSizeOptions } from "../../../constants/options/useClothingSizeOptions";
import { useGloveSizeOptions } from "../../../constants/options/useGlovesOptions";

type Props = {
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormValues) => void | Promise<void>;
  busy?: boolean;
};

export default function EmployeeForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();
  const { options: jobPositionOptions, isLoading: loadingJobs } =
    useJobPositionOptions();
  const clothingOptions = useClothingSizeOptions();
  const gloveOptions = useGloveSizeOptions();
  const fields: FieldConfig<EmployeeFormValues>[] = [
    {
      name: "firstName",
      label: t("employees.form.field.firstName"),
      required: true,
    },
    {
      name: "lastName",
      label: t("employees.form.field.lastName"),
      required: true,
    },
    {
      name: "email",
      label: t("employees.form.field.email"),
      required: true,
      props: {
        inputProps: { type: "email", inputMode: "email" },
      },
    },
    {
      name: "phoneNumber",
      label: t("employees.form.field.phoneNumber"),
      required: true,
    },
    {
      name: "oib",
      label: t("employees.form.field.oib"),
      required: true,
      props: {
        inputProps: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 11 },
        helperText: t("employees.form.helper.oibDigits"),
      },
    },
    {
      name: "dateOfBirth",
      label: t("employees.form.field.dateOfBirth"),
      type: "date",
      required: true,
    },
    {
      name: "employmentDate",
      label: t("employees.form.field.employmentDate"),
      type: "date",
      required: true,
    },
    {
      name: "terminationDate",
      label: t("employees.form.field.terminationDate"),
      type: "date",
    },
    {
      name: "hasMachineryLicense",
      label: t("employees.form.field.hasMachineryLicense"),
      type: "checkbox",
    },
    {
      name: "clothingSize",
      label: t("employees.form.field.clothingSize"),
      type: "select",
      options: clothingOptions,
    },
    {
      name: "gloveSize",
      label: t("employees.form.field.gloveSize"),
      type: "select",
      options: gloveOptions,
    },
    {
      name: "shoeSize",
      label: t("employees.form.field.shoeSize"),
      type: "number",
      props: { inputProps: { min: 20, max: 55 } },
    },
    {
      name: "description",
      label: t("employees.form.field.description"),
      props: { minRows: 3 },
    },
    {
      name: "jobPositionId",
      label: t("employees.form.field.jobPositionId"),
      type: "select",
      options: [
        { label: t("employees.form.jobPosition.none"), value: "" },
        ...jobPositionOptions,
      ],
    },
  ];

  return (
    <SmartForm<EmployeeFormValues>
      fields={fields}
      rows={[
        ["firstName", "lastName"],
        ["email", "phoneNumber"],
        ["oib"],
        ["dateOfBirth", "employmentDate", "terminationDate"],
        ["hasMachineryLicense"],
        ["clothingSize", "gloveSize", "shoeSize"],
        ["description"],
        ["jobPositionId"],
      ]}
      defaultValues={defaultValues}
      busy={busy || loadingJobs}
      submitLabel={t("employees.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
