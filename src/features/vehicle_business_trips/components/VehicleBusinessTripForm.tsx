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
  showEmployeeField?: boolean;
};

export default function VehicleBusinessTripForm<
  M extends VehicleBusinessTripMode
>({ defaultValues, onSubmit, busy, showEmployeeField = true }: Props<M>) {
  const { t } = useTranslation();

  const {
    options: employeeOptions,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useEmployeeOptions();

  const fields: FieldConfig<any>[] = [
    ...(showEmployeeField
      ? ([
        {
          name: "employeeId",
          label: t("vehicleBusinessTrips.form.field.employeeId"),
          required: true,
          type: "select" as const,
          options: employeeOptions,
          props: {
            disabled: employeesLoading || employeesError,
          },
        },
      ] satisfies FieldConfig<any>[])
      : []),

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
      name: "purposeOfTrip",
      label: t("vehicleBusinessTrips.form.field.purposeOfTrip"),
      required: true,
    },
    {
      name: "startAt",
      label: t("vehicleBusinessTrips.form.field.startAt"),
      type: "date" as const,
      required: true,
    },
    {
      name: "endAt",
      label: t("vehicleBusinessTrips.form.field.endAt"),
      type: "date" as const,
      required: true,
    },
  ];

  const isBusy = busy || (showEmployeeField && employeesLoading);

  return (
    <SmartForm<any>
      fields={fields}
      rows={[
        ...(showEmployeeField ? ([["employeeId"]] as any) : []),
        ["startLocationText", "endLocationText"],
        ["purposeOfTrip"],
        ["startAt", "endAt"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("vehicleBusinessTrips.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
