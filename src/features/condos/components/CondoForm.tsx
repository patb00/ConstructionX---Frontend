import { useTranslation } from "react-i18next";
import type { NewCondoRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewCondoRequest>;
  onSubmit: (values: NewCondoRequest) => void | Promise<void>;
  busy?: boolean;
  employeeOptions: Option[];
  currencyOptions: Option[];
};

export default function CondoForm({
  defaultValues,
  onSubmit,
  busy,
  employeeOptions,
  currencyOptions,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewCondoRequest>[] = [
    { name: "address", label: t("condos.form.field.address"), required: true },
    {
      name: "capacity",
      label: t("condos.form.field.capacity"),
      type: "number",
      required: true,
    },
    {
      name: "currentlyOccupied",
      label: t("condos.form.field.currentlyOccupied"),
      type: "number",
      required: true,
    },
    {
      name: "leaseStartDate",
      label: t("condos.form.field.leaseStartDate"),
      type: "date",
      required: true,
    },
    {
      name: "leaseEndDate",
      label: t("condos.form.field.leaseEndDate"),
      type: "date",
      required: true,
    },
    {
      name: "responsibleEmployeeId",
      label: t("condos.form.field.responsibleEmployeeId"),
      type: "select",
      required: true,
      options: employeeOptions,
    },
    {
      name: "pricePerDay",
      label: t("condos.form.field.pricePerDay"),
      type: "number",
      required: true,
    },
    {
      name: "pricePerMonth",
      label: t("condos.form.field.pricePerMonth"),
      type: "number",
      required: true,
    },
    {
      name: "currency",
      label: t("condos.form.field.currency"),
      type: "select",
      required: true,
      options: currencyOptions,
    },
    { name: "notes", label: t("condos.form.field.notes") },
  ];

  return (
    <SmartForm<NewCondoRequest>
      fields={fields}
      rows={[
        ["address"],
        ["capacity", "currentlyOccupied"],
        ["leaseStartDate", "leaseEndDate"],
        ["responsibleEmployeeId", "currency"],
        ["pricePerDay", "pricePerMonth"],
        ["notes"],
      ]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("condos.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
