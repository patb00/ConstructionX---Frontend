import { useQuery } from "@tanstack/react-query";
import type { MedicalExamination } from "..";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";

export function useMedicalExamination(medicalExaminationId: number) {
  return useQuery<MedicalExamination>({
    queryKey: medicalExaminationsKeys.detail(medicalExaminationId),
    queryFn: () => MedicalExaminationsApi.getById(medicalExaminationId),
    enabled: !!medicalExaminationId,
  });
}
