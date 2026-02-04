import type { UpdateCertificationRequest } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

export function certificationToDefaultValues(
  certification: any | null | undefined
): Partial<Omit<UpdateCertificationRequest, "id">> | undefined {
  if (!certification) return undefined;

  return {
    employeeId: certification.employeeId,
    certificationTypeId: certification.certificationTypeId,
    certificationDate: toYMD(certification.certificationDate),
    nextCertificationDate: toYMD(certification.nextCertificationDate),
    status: certification.status ?? "",
    certificatePath: certification.certificatePath ?? "",
    note: certification.note ?? "",
    reminderSentDate: toYMD(certification.reminderSentDate),
  };
}

export function certificationToUpdatePayload(
  id: number,
  values: Omit<UpdateCertificationRequest, "id">
): UpdateCertificationRequest {
  return { id, ...values };
}
