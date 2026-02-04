import { useTranslation } from "react-i18next";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";

import type {
  NewMedicalExaminationRequest,
  UpdateMedicalExaminationRequest,
} from "..";

import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { useMedicalExaminationTypeOptions } from "../../constants/options/useMedicalExaminationTypesOptions";

type MedicalExaminationMode = "create" | "edit";

type MedicalExaminationFormValues<M extends MedicalExaminationMode> =
  M extends "create"
    ? NewMedicalExaminationRequest
    : Omit<UpdateMedicalExaminationRequest, "id">;

type Props<M extends MedicalExaminationMode> = {
  mode: M;

  defaultValues?: Partial<MedicalExaminationFormValues<M>>;
  onSubmit: (values: MedicalExaminationFormValues<M>) => void | Promise<void>;
  busy?: boolean;

  showEmployeeField?: boolean;

  selectedFile?: File | null;
  onFileChange?: (file: File | null) => void;
  fileAccept?: string;
  existingCertificatePath?: string | null;
  onDownload?: () => void;
};

export default function MedicalExaminationForm<
  M extends MedicalExaminationMode
>({
  defaultValues,
  onSubmit,
  busy,
  showEmployeeField = true,
  selectedFile,
  onFileChange,
  fileAccept = ".pdf,image/*",
  existingCertificatePath,
  onDownload,
}: Props<M>) {
  const { t } = useTranslation();

  const {
    options: employeeOptions,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useEmployeeOptions();

  const { options: examinationTypeOptions, isLoading: typesLoading } =
    useMedicalExaminationTypeOptions();

  const fields: FieldConfig<any>[] = [
    ...(showEmployeeField
      ? [
          {
            name: "employeeId",
            label: t("medicalExaminations.form.field.employeeId"),
            required: true,
            type: "select",
            options: employeeOptions,
            disabled: employeesLoading || employeesError,
          },
        ]
      : []),

    {
      name: "examinationTypeId",
      label: t("medicalExaminations.form.field.examinationTypeId"),
      required: true,
      type: "select",
      options: examinationTypeOptions,
      disabled: typesLoading,
    },
    {
      name: "examinationDate",
      label: t("medicalExaminations.form.field.examinationDate"),
      type: "date",
      required: true,
    },
    {
      name: "nextExaminationDate",
      label: t("medicalExaminations.form.field.nextExaminationDate"),
      type: "date",
      required: true,
    },
    {
      name: "result",
      label: t("medicalExaminations.form.field.result"),
      required: true,
    },
    {
      name: "note",
      label: t("medicalExaminations.form.field.note"),
    },
    {
      name: "attachment" as any,
      label: t("medicalExaminations.form.field.attachmentLabel", {
        defaultValue: "Attachment",
      }),
      type: "file",
      fileConfig: {
        file: selectedFile ?? null,
        onChange: onFileChange,
        accept: fileAccept,
        existingFileName: existingCertificatePath ?? null,
        onDownload: onDownload,
      },
    } as any,
  ];

  const isBusy = busy || employeesLoading || typesLoading;

  return (
    <SmartForm<any>
      fields={fields}
      rows={[
        ["employeeId", "examinationTypeId"],
        ["examinationDate", "nextExaminationDate"],
        ["result", "note"],
        ["attachment"],
      ]}
      defaultValues={defaultValues}
      busy={isBusy}
      submitLabel={t("medicalExaminations.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
