import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { NewVehicleBusinessTripRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewVehicleBusinessTripRequest>;
  onSubmit: (values: NewVehicleBusinessTripRequest) => void | Promise<void>;
  busy?: boolean;
  vehicleOptions: Option[];
  employeeOptions: Option[];
};

export default function VehicleBusinessTripForm({
  defaultValues,
  onSubmit,
  busy,
  vehicleOptions,
  employeeOptions,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewVehicleBusinessTripRequest>[] = useMemo(
    () => [
      {
        name: "vehicleId",
        label: t("vehicleBusinessTrips.form.field.vehicleId"),
        type: "select",
        required: true,
        options: vehicleOptions,
      },
      {
        name: "employeeId",
        label: t("vehicleBusinessTrips.form.field.employeeId"),
        type: "select",
        required: true,
        options: employeeOptions,
      },
      {
        name: "startLocationText",
        label: t("vehicleBusinessTrips.form.field.startLocationText"),
        required: true,
      },
      {
        name: "endLocationText",
        label: t("vehicleBusinessTrips.form.field.endLocationText"),
        required: true,
      },
      {
        name: "startAt",
        label: t("vehicleBusinessTrips.form.field.startAt"),
        type: "datetime-local",
        required: true,
      },
      {
        name: "endAt",
        label: t("vehicleBusinessTrips.form.field.endAt"),
        type: "datetime-local",
        required: true,
      },
      {
        name: "startKilometers",
        label: t("vehicleBusinessTrips.form.field.startKilometers"),
        type: "number",
        required: true,
      },
      {
        name: "endKilometers",
        label: t("vehicleBusinessTrips.form.field.endKilometers"),
        type: "number",
        required: true,
      },
      {
        name: "refueled",
        label: t("vehicleBusinessTrips.form.field.refueled"),
        type: "checkbox",
      },
      {
        name: "fuelLiters",
        label: t("vehicleBusinessTrips.form.field.fuelLiters"),
        type: "number",
      },
      {
        name: "fuelAmount",
        label: t("vehicleBusinessTrips.form.field.fuelAmount"),
        type: "number",
      },
      {
        name: "fuelCurrency",
        label: t("vehicleBusinessTrips.form.field.fuelCurrency"),
      },
      {
        name: "note",
        label: t("vehicleBusinessTrips.form.field.note"),
      },
    ],
    [t, vehicleOptions, employeeOptions]
  );

  return (
    <SmartForm<NewVehicleBusinessTripRequest>
      fields={fields}
      rows={[
        ["vehicleId", "employeeId"],
        ["startLocationText", "endLocationText"],
        ["startAt", "endAt"],
        ["startKilometers", "endKilometers"],
        ["refueled"],
        ["fuelLiters", "fuelAmount", "fuelCurrency"],
        ["note"],
      ]}
      defaultValues={defaultValues}
      busy={busy}
      submitLabel={t("vehicleBusinessTrips.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
