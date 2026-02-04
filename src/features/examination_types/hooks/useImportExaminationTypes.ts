import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ExaminationTypesApi } from "../api/examination-types.api";
import { examinationTypesKeys } from "../api/examination-types.keys";

export function useImportExaminationTypes() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await ExaminationTypesApi.import(file);
      await queryClient.invalidateQueries({ queryKey: examinationTypesKeys.all });
      return result;
    },
    [queryClient]
  );
}
