import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { NewVehicleRepairRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

import { useVehicleOptions } from "../../constants/options/useVehicleOptions";
import { useVehicleConditionOptions } from "../../constants/options/useVehicleConditionOptions";

type Props = {
  defaultValues?: Partial<NewVehicleRepairRequest>;
  onSubmit: (values: NewVehicleRepairRequest) => void | Promise<void>;
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

  const { options: conditionOptions, isLoading: conditionsLoading } =
    useVehicleConditionOptions();

  const fields: FieldConfig<NewVehicleRepairRequest>[] = useMemo(
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
        transformOut: (v) => Number(v),
      },
      {
        name: "condition",
        label: t("vehicleRepairs.form.field.condition"),
        type: "select",
        options: conditionOptions,
      },
      {
        name: "description",
        label: t("vehicleRepairs.form.field.description"),
        type: "textarea",
      },
    ],
    [t, vehicleOptions, conditionOptions]
  );

  const isBusy = busy || vehiclesLoading || conditionsLoading;

  return (
    <SmartForm<NewVehicleRepairRequest>
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
