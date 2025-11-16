import { useTranslation } from "react-i18next";
import type { NewVehicleRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewVehicleRequest>;
  onSubmit: (values: NewVehicleRequest) => void | Promise<void>;
  busy?: boolean;
  statusOptions: Option[];
  conditionOptions: Option[];
  typeOptions: Option[];
};

export default function VehicleForm({
  defaultValues,
  onSubmit,
  busy,
  statusOptions,
  conditionOptions,
  typeOptions,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewVehicleRequest>[] = [
    {
      name: "name",
      label: t("vehicles.form.field.name"),
      required: true,
    },
    {
      name: "registrationNumber",
      label: t("vehicles.form.field.registrationNumber"),
    },
    {
      name: "vin",
      label: t("vehicles.form.field.vin"),
    },
    {
      name: "brand",
      label: t("vehicles.form.field.brand"),
    },
    {
      name: "model",
      label: t("vehicles.form.field.model"),
    },
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
    {
      name: "weight",
      label: t("vehicles.form.field.weight"),
      type: "number",
    },
    {
      name: "description",
      label: t("vehicles.form.field.description"),
    },
  ];

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
      defaultValues={{
        name: "",
        registrationNumber: null as any,
        vin: null as any,
        brand: null as any,
        model: null as any,
        yearOfManufacturing: null as any,
        vehicleType: null as any,
        status: null as any,
        purchaseDate: "",
        purchasePrice: 0,
        description: null as any,
        condition: null as any,
        horsePower: null as any,
        averageConsumption: null as any,
        weight: null as any,
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("vehicles.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
