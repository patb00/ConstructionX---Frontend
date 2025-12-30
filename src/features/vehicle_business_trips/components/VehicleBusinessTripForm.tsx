import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

import type {
  NewVehicleBusinessTripRequest,
  UpdateVehicleBusinessTripRequest,
} from "..";

import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useVehicleBusinessTripStatusOptions } from "../../constants/enum/useVehicleBusinessTripStatusOptions";

type VehicleBusinessTripMode = "create" | "edit";

type VehicleBusinessTripFormValues<M extends VehicleBusinessTripMode> =
  M extends "create"
    ? NewVehicleBusinessTripRequest
    : Omit<UpdateVehicleBusinessTripRequest, "id">;

type Props<M extends VehicleBusinessTripMode> = {
  mode: M;
  defaultValues?: Partial<VehicleBusinessTripFormValues<M>>;
  onSubmit: (values: VehicleBusinessTripFormValues<M>) => void | Promise<void>;
  busy?: boolean;
  showStatusField?: boolean;
};

export default function VehicleBusinessTripForm<
  M extends VehicleBusinessTripMode
>({ defaultValues, onSubmit, busy, showStatusField = false }: Props<M>) {
  const { t } = useTranslation();

  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const { options: employeeOptions, isLoading: employeesLoading } =
    useEmployeeOptions();

  const statusOptions = useVehicleBusinessTripStatusOptions();

  const [isRefueled, setIsRefueled] = useState<boolean>(
    Boolean(defaultValues?.refueled)
  );

  useEffect(() => {
    setIsRefueled(Boolean(defaultValues?.refueled));
  }, [defaultValues?.refueled]);

  const fields: FieldConfig<any>[] = [
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
    },
    {
      name: "endKilometers",
      label: t("vehicleBusinessTrips.form.field.endKilometers"),
      type: "number",
    },

    ...(showStatusField
      ? [
          {
            name: "tripStatus",
            label: t("vehicleBusinessTrips.form.field.tripStatus", "Status"),
            type: "select" as const,
            required: true,
            options: statusOptions,
          },
        ]
      : []),

    {
      name: "refueled",
      label: t("vehicleBusinessTrips.form.field.refueled"),
      type: "checkbox",
    },
    {
      name: "fuelLiters",
      label: t("vehicleBusinessTrips.form.field.fuelLiters"),
      type: "number",
      props: { disabled: !isRefueled },
    },
    {
      name: "fuelAmount",
      label: t("vehicleBusinessTrips.form.field.fuelAmount"),
      type: "number",
      props: { disabled: !isRefueled },
    },
    {
      name: "fuelCurrency",
      label: t("vehicleBusinessTrips.form.field.fuelCurrency"),
      props: { disabled: !isRefueled },
    },
    {
      name: "note",
      label: t("vehicleBusinessTrips.form.field.note"),
    },
  ];

  const rows = [
    ["vehicleId", "employeeId"],
    ["startLocationText", "endLocationText"],
    ["startAt", "endAt"],
    ["startKilometers", "endKilometers"],
    ...(showStatusField ? [["tripStatus"]] : []),
    ["refueled"],
    ["fuelLiters", "fuelAmount", "fuelCurrency"],
    ["note"],
  ];

  const isBusy = busy || vehiclesLoading || employeesLoading;

  return (
    <SmartForm<any>
      fields={fields}
      rows={rows as any}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("vehicleBusinessTrips.form.submit")}
      onSubmit={onSubmit}
      renderFooterActions={(values) => {
        if (values.refueled !== isRefueled) {
          setIsRefueled(Boolean(values.refueled));
        }
        return null;
      }}
    />
  );
}
