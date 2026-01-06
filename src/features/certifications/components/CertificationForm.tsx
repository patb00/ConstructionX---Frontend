import { useTranslation } from "react-i18next";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

import type { NewCertificationRequest, UpdateCertificationRequest } from "..";

import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { useCertificationTypeOptions } from "../../constants/options/useCertificationTypesOptions";
import { useCertificationStatusOptions } from "../../constants/options/useCertificationStatusOptions";

type CertificationMode = "create" | "edit";

type CertificationFormValues<M extends CertificationMode> = M extends "create"
  ? NewCertificationRequest
  : Omit<UpdateCertificationRequest, "id">;

type Props<M extends CertificationMode> = {
  mode: M;
  defaultValues?: Partial<CertificationFormValues<M>>;
  onSubmit: (values: CertificationFormValues<M>) => void | Promise<void>;
  busy?: boolean;
  showEmployeeField?: boolean;
};

export default function CertificationForm<M extends CertificationMode>({
  defaultValues,
  onSubmit,
  busy,
  showEmployeeField = true,
}: Props<M>) {
  const { t } = useTranslation();

  const {
    options: employeeOptions,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useEmployeeOptions();

  const { options: certificationTypeOptions, isLoading: typesLoading } =
    useCertificationTypeOptions();

  const { options: statusOptions } = useCertificationStatusOptions();

  const fields: FieldConfig<CertificationFormValues<M>>[] = [
    ...(showEmployeeField
      ? ([
          {
            name: "employeeId",
            label: t("certifications.form.field.employeeId"),
            required: true,
            type: "select",
            options: employeeOptions,
            props: {
              disabled: employeesLoading || employeesError,
            },
          },
        ] as FieldConfig<CertificationFormValues<M>>[])
      : []),

    {
      name: "certificationTypeId",
      label: t("certifications.form.field.certificationTypeId"),
      required: true,
      type: "select",
      options: certificationTypeOptions,
      props: {
        disabled: typesLoading,
      },
    },
    {
      name: "certificationDate",
      label: t("certifications.form.field.certificationDate"),
      type: "date",
      required: true,
    },
    {
      name: "nextCertificationDate",
      label: t("certifications.form.field.nextCertificationDate"),
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: t("certifications.form.field.status"),
      required: true,
      type: "select",
      options: statusOptions,
    },
    {
      name: "certificatePath",
      label: t("certifications.form.field.certificatePath"),
      type: "text",
    },
    {
      name: "reminderSentDate",
      label: t("certifications.form.field.reminderSentDate"),
      type: "date",
    },
    {
      name: "note",
      label: t("certifications.form.field.note"),
      type: "text",
    },
  ];

  const isBusy = busy || employeesLoading || typesLoading;

  return (
    <SmartForm<CertificationFormValues<M>>
      fields={fields}
      rows={[
        ["employeeId", "certificationTypeId"],
        ["certificationDate", "nextCertificationDate"],
        ["status", "certificatePath"],
        ["reminderSentDate", "note"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("certifications.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
