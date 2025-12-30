import type { UpdateMedicalExaminationRequest } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

export function medicalExaminationToDefaultValues(
  exam: any | null | undefined
): Partial<Omit<UpdateMedicalExaminationRequest, "id">> | undefined {
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
  values: Omit<UpdateMedicalExaminationRequest, "id">
): UpdateMedicalExaminationRequest {
  return { id, ...values };
}
