import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { EmployeeFormValues } from "..";
import { useJobPositionOptions } from "../hooks/useJobPositionOptions";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormValues) => void | Promise<void>;
  busy?: boolean;
};

export default function EmployeeForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();
  const { options: jobPositionOptions } = useJobPositionOptions();

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
      options: [
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "XXL", value: "XXL" },
      ],
    },
    {
      name: "gloveSize",
      label: t("employees.form.field.gloveSize"),
      type: "select",
      options: [
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
      ],
    },
    {
      name: "shoeSize",
      label: t("employees.form.field.shoeSize"),
      type: "number",
      props: { inputProps: { min: 20, max: 55 } },
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
        ["oib"],
        ["dateOfBirth", "employmentDate", "terminationDate"],
        ["hasMachineryLicense"],
        ["clothingSize", "gloveSize", "shoeSize"],
        ["jobPositionId"],
      ]}
      defaultValues={{
        firstName: "",
        lastName: "",
        oib: "",
        dateOfBirth: defaultValues?.dateOfBirth,
        employmentDate: defaultValues?.employmentDate,
        terminationDate: defaultValues?.terminationDate,
        hasMachineryLicense: defaultValues?.hasMachineryLicense ?? false,
        clothingSize: defaultValues?.clothingSize ?? "",
        gloveSize: defaultValues?.gloveSize ?? "",
        shoeSize:
          typeof defaultValues?.shoeSize === "number"
            ? defaultValues.shoeSize
            : ("" as unknown as number),
        jobPositionId:
          typeof defaultValues?.jobPositionId === "number"
            ? defaultValues.jobPositionId
            : "",
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("employees.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
