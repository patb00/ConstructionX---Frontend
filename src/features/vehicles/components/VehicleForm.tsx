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
      label: t("vehicles.form.field.name", { defaultValue: "Name" }),
      required: true,
    },
    {
      name: "registrationNumber",
      label: t("vehicles.form.field.registrationNumber", {
        defaultValue: "Registration number",
      }),
    },
    {
      name: "vin",
      label: t("vehicles.form.field.vin", { defaultValue: "VIN" }),
    },
    {
      name: "brand",
      label: t("vehicles.form.field.brand", { defaultValue: "Brand" }),
    },
    {
      name: "model",
      label: t("vehicles.form.field.model", { defaultValue: "Model" }),
    },
    {
      name: "yearOfManufacturing",
      label: t("vehicles.form.field.yearOfManufacturing", {
        defaultValue: "Year of manufacturing",
      }),
      type: "number",
    },
    {
      name: "vehicleType",
      label: t("vehicles.form.field.vehicleType", {
        defaultValue: "Vehicle type",
      }),
      type: "select",
      options: typeOptions,
    },
    {
      name: "status",
      label: t("vehicles.form.field.status", { defaultValue: "Status" }),
      type: "select",
      options: statusOptions,
    },
    {
      name: "condition",
      label: t("vehicles.form.field.condition", { defaultValue: "Condition" }),
      type: "select",
      options: conditionOptions,
    },
    {
      name: "purchaseDate",
      label: t("vehicles.form.field.purchaseDate", {
        defaultValue: "Purchase date",
      }),
      type: "date",
      required: true,
    },
    {
      name: "purchasePrice",
      label: t("vehicles.form.field.purchasePrice", {
        defaultValue: "Purchase price",
      }),
      type: "number",
      required: true,
    },
    {
      name: "horsePower",
      label: t("vehicles.form.field.horsePower", {
        defaultValue: "Horse power",
      }),
      type: "number",
    },
    {
      name: "averageConsumption",
      label: t("vehicles.form.field.averageConsumption", {
        defaultValue: "Average consumption",
      }),
      type: "number",
    },
    {
      name: "weight",
      label: t("vehicles.form.field.weight", { defaultValue: "Weight (kg)" }),
      type: "number",
    },
    {
      name: "description",
      label: t("vehicles.form.field.description", {
        defaultValue: "Description",
      }),
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
      submitLabel={t("vehicles.form.submit", { defaultValue: "Save" })}
      onSubmit={onSubmit}
    />
  );
}
