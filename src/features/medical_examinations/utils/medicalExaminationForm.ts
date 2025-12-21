import type { NewMedicalExaminationRequest } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

export function medicalExaminationToDefaultValues(
  exam: any | null | undefined
): Partial<NewMedicalExaminationRequest> | undefined {
  if (!exam) return undefined;

  return {
    examinationTypeId: exam.examinationTypeId,
    examinationDate: toYMD(exam.examinationDate),
    nextExaminationDate: toYMD(exam.nextExaminationDate),
    result: exam.result ?? "",
    note: exam.note ?? "",
  };
}

export function medicalExaminationToUpdatePayload(
  id: number,
  values: NewMedicalExaminationRequest
) {
  const { employeeId: _ignored, ...rest } = values as any;
  return { id, ...rest };
}
