import { useQuery } from "@tanstack/react-query";
import type { ExaminationType } from "..";
import { examinationTypesKeys } from "../api/examination-types.keys";
import { ExaminationTypesApi } from "../api/examination-types.api";

export function useExaminationType(examinationTypeId: number) {
  return useQuery<ExaminationType>({
    queryKey: examinationTypesKeys.detail(examinationTypeId),
    queryFn: () => ExaminationTypesApi.getById(examinationTypeId),
    enabled: !!examinationTypeId,
  });
}
