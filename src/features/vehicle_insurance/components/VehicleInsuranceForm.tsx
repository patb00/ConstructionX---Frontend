import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { NewVehicleInsuranceRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useVehicleOptions } from "../../constants/options/useVehicleOptions";

type Props = {
  defaultValues?: Partial<NewVehicleInsuranceRequest>;
  onSubmit: (values: NewVehicleInsuranceRequest) => void | Promise<void>;
  busy?: boolean;
  policyTypeOptions?: { label: string; value: number }[];

  docFile?: File | null;
  onDocFileChange?: (file: File | null) => void;
  onDownload?: () => void;
};

export default function VehicleInsuranceForm({
  defaultValues,
  onSubmit,
  busy,
  policyTypeOptions = [],
  docFile,
  onDocFileChange,
  onDownload,
}: Props) {
  const { t } = useTranslation();

  const { options: vehicleOptions, isLoading: vehiclesLoading } =
    useVehicleOptions();

  const fields: FieldConfig<NewVehicleInsuranceRequest>[] = useMemo(
    () => [
      {
        name: "vehicleId",
        label: t("vehicleInsurances.form.field.vehicleId"),
        type: "select",
        required: true,
        options: vehicleOptions,
        transformOut: (v) => Number(v),
      },
      {
        name: "insurer",
        label: t("vehicleInsurances.form.field.insurer"),
        required: true,
      },
      {
        name: "policyNumber",
        label: t("vehicleInsurances.form.field.policyNumber"),
      },
      {
        name: "policyType",
        label: t("vehicleInsurances.form.field.policyType"),
        type: policyTypeOptions.length ? "select" : "number",
        options: policyTypeOptions.length ? policyTypeOptions : undefined,
        transformOut: (v) => (v === "" || v == null ? null : Number(v)),
      },
      {
        name: "costAmount",
        label: t("vehicleInsurances.form.field.costAmount"),
        type: "number",
        required: true,
      },
      {
        name: "costCurrency",
        label: t("vehicleInsurances.form.field.costCurrency"),
      },
      {
        name: "validFrom",
        label: t("vehicleInsurances.form.field.validFrom"),
        type: "date",
        required: true,
      },
      {
        name: "validTo",
        label: t("vehicleInsurances.form.field.validTo"),
        type: "date",
        required: true,
      },
      {
        name: "documentPath",
        label: t("vehicleInsurances.form.field.documentPath"),
        type: "file",
        fileConfig: {
          file: docFile ?? null,
          onChange: onDocFileChange,
          accept: ".pdf,.png,.jpg,.jpeg",
          existingFileName: defaultValues?.documentPath ?? null,
          onDownload: onDownload,
        },
        transformOut: (fileOrName) => {
          if (fileOrName instanceof File) return fileOrName.name;
          return fileOrName ?? null;
        },
      },
    ],
    [
      t,
      vehicleOptions,
      policyTypeOptions,
      docFile,
      defaultValues?.documentPath,
      onDocFileChange,
      onDownload,
    ]
  );

  const isBusy = busy || vehiclesLoading;

  return (
    <SmartForm<NewVehicleInsuranceRequest>
      fields={fields}
      rows={[
        ["vehicleId"],
        ["insurer", "policyNumber"],
        ["policyType", "costAmount"],
        ["costCurrency"],
        ["validFrom", "validTo"],
        ["documentPath"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("vehicleInsurances.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
