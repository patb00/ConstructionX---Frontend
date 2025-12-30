import { useEffect, useState } from "react";
import type { NewVehicleBusinessTripRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";
import { useVehicleBusinessTripStatusOptions } from "../../constants/enum/useVehicleBusinessTripStatusOptions";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewVehicleBusinessTripRequest>;
  onSubmit: (values: any) => void | Promise<void>;
  busy?: boolean;
  vehicleOptions: Option[];
  employeeOptions: Option[];
  showStatusField?: boolean;
  statusOptions?: Option[];
};

export default function VehicleBusinessTripForm({
  defaultValues,
  onSubmit,
  busy,
  vehicleOptions,
  employeeOptions,
  showStatusField = false,
  statusOptions,
}: Props) {
  const { t } = useTranslation();

  const [isRefueled, setIsRefueled] = useState<boolean>(
    Boolean(defaultValues?.refueled)
  );

  useEffect(() => {
    setIsRefueled(Boolean(defaultValues?.refueled));
  }, [defaultValues?.refueled]);

  const defaultStatusOptions = useVehicleBusinessTripStatusOptions();
  const finalStatusOptions = statusOptions ?? defaultStatusOptions;

  const fields: FieldConfig<NewVehicleBusinessTripRequest>[] = [
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

    ...(showStatusField
      ? ([
          {
            name: "tripStatus" as any,
            label: t("vehicleBusinessTrips.form.field.tripStatus", "Status"),
            type: "select",
            required: true,
            options: finalStatusOptions,
          },
        ] as FieldConfig<NewVehicleBusinessTripRequest>[])
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
      props: {
        disabled: !isRefueled,
      },
    },
    {
      name: "fuelAmount",
      label: t("vehicleBusinessTrips.form.field.fuelAmount"),
      type: "number",
      props: {
        disabled: !isRefueled,
      },
    },
    {
      name: "fuelCurrency",
      label: t("vehicleBusinessTrips.form.field.fuelCurrency"),
      props: {
        disabled: !isRefueled,
      },
    },
    {
      name: "note",
      label: t("vehicleBusinessTrips.form.field.note"),
    },
  ];

  const rows: Array<(keyof NewVehicleBusinessTripRequest & string)[]> = [
    ["vehicleId", "employeeId"],
    ["startLocationText", "endLocationText"],
    ["startAt", "endAt"],
    ["startKilometers", "endKilometers"],
    ...(showStatusField ? ([["tripStatus" as any]] as any) : []),
    ["refueled"],
    ["fuelLiters", "fuelAmount", "fuelCurrency"],
    ["note"],
  ] as any;

  return (
    <SmartForm<NewVehicleBusinessTripRequest>
      fields={fields}
      rows={rows}
      defaultValues={defaultValues}
      busy={busy}
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
