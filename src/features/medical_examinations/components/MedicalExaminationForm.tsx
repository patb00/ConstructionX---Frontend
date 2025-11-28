import type { NewMedicalExaminationRequest } from "..";
import {
  SmartForm,
  type FieldConfig,
} from "../../../components/ui/smartform/SmartForm";
import { useTranslation } from "react-i18next";

type Option = { label: string; value: any };

type Props = {
  defaultValues?: Partial<NewMedicalExaminationRequest>;
  onSubmit: (values: NewMedicalExaminationRequest) => void | Promise<void>;
  busy?: boolean;
  employeeOptions: Option[];
  examinationTypeOptions: Option[];
  showEmployeeField?: boolean;
  selectedFile?: File | null;
  onFileChange?: (file: File | null) => void;
  fileAccept?: string;
  existingCertificatePath?: string | null;
};

export default function MedicalExaminationForm({
  defaultValues,
  onSubmit,
  busy,
  employeeOptions,
  examinationTypeOptions,
  showEmployeeField = true,
  selectedFile,
  onFileChange,
  fileAccept = ".pdf,image/*",
  existingCertificatePath,
}: Props) {
  const { t } = useTranslation();

  const fields: FieldConfig<NewMedicalExaminationRequest>[] = [
    ...(showEmployeeField
      ? ([
          {
            name: "employeeId",
            label: t("medicalExaminations.form.field.employeeId"),
            required: true,
            type: "select",
            options: employeeOptions,
          },
        ] as FieldConfig<NewMedicalExaminationRequest>[])
      : []),
    {
      name: "examinationTypeId",
      label: t("medicalExaminations.form.field.examinationTypeId"),
      required: true,
      type: "select",
      options: examinationTypeOptions,
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
      },
    } as any,
  ];

  const rows: Array<(keyof NewMedicalExaminationRequest & string)[]> =
    showEmployeeField
      ? ([
          ["employeeId", "examinationTypeId"],
          ["examinationDate", "nextExaminationDate"],
          ["result", "note"],
          ["attachment" as any],
        ] as any)
      : ([
          ["examinationTypeId"],
          ["examinationDate", "nextExaminationDate"],
          ["result", "note"],
          ["attachment" as any],
        ] as any);

  return (
    <SmartForm<NewMedicalExaminationRequest>
      fields={fields}
      rows={rows}
      defaultValues={{
        ...(showEmployeeField && {
          employeeId: employeeOptions?.[0]?.value ?? 0,
        }),
        examinationTypeId: examinationTypeOptions?.[0]?.value ?? 0,
        examinationDate: "",
        nextExaminationDate: "",
        result: "",
        note: "",
        ...defaultValues,
      }}
      busy={busy}
      submitLabel={t("medicalExaminations.form.submit")}
      onSubmit={onSubmit}
    />
  );
}
