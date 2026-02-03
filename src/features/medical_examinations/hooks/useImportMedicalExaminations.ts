import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MedicalExaminationsApi } from "../api/medical-examinations.api";
import { medicalExaminationsKeys } from "../api/medical-examinations.keys";

export function useImportMedicalExaminations() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await MedicalExaminationsApi.import(file);
      await queryClient.invalidateQueries({ queryKey: medicalExaminationsKeys.all });
      return result;
    },
    [queryClient]
  );
}
