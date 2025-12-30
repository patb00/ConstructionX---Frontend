import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NewVehicleRegistrationRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";

type Props = {
  defaultValues?: Partial<NewVehicleRegistrationRequest>;
  onSubmit: (values: NewVehicleRegistrationRequest) => void | Promise<void>;
  busy?: boolean;
};

export default function VehicleRegistrationForm({
  defaultValues,
  onSubmit,
  busy,
}: Props) {
  const { t } = useTranslation();
  const [docFile, setDocFile] = useState<File | null>(null);

  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const fields: FieldConfig<NewVehicleRegistrationRequest>[] = useMemo(
    () => [
      {
        name: "vehicleId",
        label: t("vehicleRegistrations.form.field.vehicleId"),
        type: "select",
        required: true,
        options: vehicleOptions,
        transformOut: (v) => Number(v),
      },
      {
        name: "validFrom",
        label: t("vehicleRegistrations.form.field.validFrom"),
        type: "date",
        required: true,
      },
      {
        name: "validTo",
        label: t("vehicleRegistrations.form.field.validTo"),
        type: "date",
        required: true,
      },
      {
        name: "totalCostAmount",
        label: t("vehicleRegistrations.form.field.totalCostAmount"),
        type: "number",
        required: true,
      },
      {
        name: "costCurrency",
        label: t("vehicleRegistrations.form.field.costCurrency"),
      },
      {
        name: "registrationStationName",
        label: t("vehicleRegistrations.form.field.registrationStationName"),
      },
      {
        name: "registrationStationLocation",
        label: t("vehicleRegistrations.form.field.registrationStationLocation"),
      },
      {
        name: "reportNumber",
        label: t("vehicleRegistrations.form.field.reportNumber"),
      },
      {
        name: "documentPath",
        label: t("vehicleRegistrations.form.field.documentPath"),
        type: "file",
        fileConfig: {
          file: docFile,
          onChange: setDocFile,
          accept: ".pdf,.png,.jpg,.jpeg",
          existingFileName: defaultValues?.documentPath ?? null,
        },
        transformOut: (fileOrName) => {
          if (fileOrName instanceof File) return fileOrName.name;
          return fileOrName ?? null;
        },
      },
      {
        name: "note",
        label: t("vehicleRegistrations.form.field.note"),
      },
    ],
    [t, vehicleOptions, docFile, defaultValues?.documentPath]
  );

  const isBusy = busy || vehiclesLoading;

  return (
    <SmartForm<NewVehicleRegistrationRequest>
      fields={fields}
      rows={[
        ["vehicleId"],
        ["validFrom", "validTo"],
        ["totalCostAmount", "costCurrency"],
        ["registrationStationName", "registrationStationLocation"],
        ["reportNumber"],
        ["note"],
        ["documentPath"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("vehicleRegistrations.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
