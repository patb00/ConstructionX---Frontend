import { useTranslation } from "react-i18next";
import type { NewVehicleRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useVehicleStatusOptions } from "../../constants/options/useVehicleStatusOptions";
import { useVehicleConditionOptions } from "../../constants/options/useVehicleConditionOptions";
import { useVehicleTypeOptions } from "../../constants/options/useVehicleTypeOptions";

type Props = {
  defaultValues?: Partial<NewVehicleRequest>;
  onSubmit: (values: NewVehicleRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function VehicleForm({ defaultValues, onSubmit, busy }: Props) {
  const { t } = useTranslation();

  const { options: statusOptions, isLoading: statusesLoading } =
    useVehicleStatusOptions();

  const { options: conditionOptions, isLoading: conditionsLoading } =
    useVehicleConditionOptions();

  const { options: typeOptions, isLoading: typesLoading } =
    useVehicleTypeOptions();

  const fields: FieldConfig<NewVehicleRequest>[] = [
    { name: "name", label: t("vehicles.form.field.name"), required: true },
    {
      name: "registrationNumber",
      label: t("vehicles.form.field.registrationNumber"),
    },
    { name: "vin", label: t("vehicles.form.field.vin") },
    { name: "brand", label: t("vehicles.form.field.brand") },
    { name: "model", label: t("vehicles.form.field.model") },
    {
      name: "yearOfManufacturing",
      label: t("vehicles.form.field.yearOfManufacturing"),
      type: "number",
    },
    {
      name: "vehicleType",
      label: t("vehicles.form.field.vehicleType"),
      type: "select",
      options: typeOptions,
    },
    {
      name: "status",
      label: t("vehicles.form.field.status"),
      type: "select",
      options: statusOptions,
    },
    {
      name: "condition",
      label: t("vehicles.form.field.condition"),
      type: "select",
      options: conditionOptions,
    },
    {
      name: "purchaseDate",
      label: t("vehicles.form.field.purchaseDate"),
      type: "date",
      required: true,
    },
    {
      name: "purchasePrice",
      label: t("vehicles.form.field.purchasePrice"),
      type: "number",
      required: true,
    },
    {
      name: "horsePower",
      label: t("vehicles.form.field.horsePower"),
      type: "number",
    },
    {
      name: "averageConsumption",
      label: t("vehicles.form.field.averageConsumption"),
      type: "number",
    },
    { name: "weight", label: t("vehicles.form.field.weight"), type: "number" },
    { name: "description", label: t("vehicles.form.field.description") },
  ];

  const isBusy = busy || statusesLoading || conditionsLoading || typesLoading;

  return (
    <SmartForm<NewVehicleRequest>
      fields={fields}
      rows={[
        ["name", "registrationNumber"],
        ["vin", "vehicleType"],
        ["brand", "model"],
        ["yearOfManufacturing", "horsePower"],
        ["averageConsumption", "weight"],
        ["purchaseDate", "purchasePrice"],
        ["status", "condition"],
        ["description"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("vehicles.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
