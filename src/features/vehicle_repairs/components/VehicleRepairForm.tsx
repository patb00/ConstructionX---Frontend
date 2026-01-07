import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CreateVehicleRepairRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";

type Props = {
  defaultValues?: Partial<CreateVehicleRepairRequest>;
  onSubmit: (values: CreateVehicleRepairRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function VehicleRepairForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();
  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const fields: FieldConfig<CreateVehicleRepairRequest>[] = useMemo(
    () => [
      {
        name: "vehicleId",
        label: t("vehicleRepairs.form.field.vehicleId"),
        type: "select",
        required: true,
        options: vehicleOptions,
        transformOut: (v) => Number(v),
      },
      {
        name: "repairDate",
        label: t("vehicleRepairs.form.field.repairDate"),
        type: "date",
        required: true,
      },
      {
        name: "cost",
        label: t("vehicleRepairs.form.field.cost"),
        type: "number",
        required: true,
      },
      {
        name: "condition",
        label: t("vehicleRepairs.form.field.condition"),
        required: true,
      },
      {
        name: "description",
        label: t("vehicleRepairs.form.field.description"),
        type: "textarea",
      },
    ],
    [t, vehicleOptions]
  );

  const isBusy = busy || vehiclesLoading;

  return (
    <SmartForm<CreateVehicleRepairRequest>
      fields={fields}
      rows={[
        ["vehicleId"],
        ["repairDate", "cost"],
        ["condition"],
        ["description"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("vehicleRepairs.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
