import {
  SmartForm,
  type FieldConfig,
} from "../../../../components/ui/smartform/SmartForm";
import type { EmployeeFormValues } from "..";
import { useJobPositionOptions } from "../hooks/useJobPositionOptions";

type Props = {
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormValues) => void | Promise<void>;
  busy?: boolean;
};

export default function EmployeeForm({ defaultValues, onSubmit, busy }: Props) {
  const { options: jobPositionOptions } = useJobPositionOptions();

  const fields: FieldConfig<EmployeeFormValues>[] = [
    { name: "firstName", label: "First name", required: true },
    { name: "lastName", label: "Last name", required: true },
    {
      name: "oib",
      label: "OIB",
      required: true,
      props: {
        inputProps: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 11 },
        helperText: "11 digits",
      },
    },
    {
      name: "dateOfBirth",
      label: "Date of birth",
      type: "date",
      required: true,
    },
    {
      name: "employmentDate",
      label: "Employment date",
      type: "date",
      required: true,
    },
    { name: "terminationDate", label: "Termination date", type: "date" },
    {
      name: "hasMachineryLicense",
      label: "Has machinery license",
      type: "checkbox",
    },
    {
      name: "clothingSize",
      label: "Clothing size",
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
      label: "Glove size",
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
      label: "Shoe size",
      type: "number",
      props: { inputProps: { min: 20, max: 55 } },
    },

    {
      name: "jobPositionId",
      label: "Job position",
      type: "select",
      options: [{ label: "— None —", value: "" }, ...jobPositionOptions],
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
      submitLabel="Spremi"
      onSubmit={onSubmit}
    />
  );
}
