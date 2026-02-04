import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CondosApi } from "../api/condos.api";
import { condosKeys } from "../api/condos.keys";

export function useImportCondos() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await CondosApi.import(file);
      await queryClient.invalidateQueries({ queryKey: condosKeys.all });
      return result;
    },
    [queryClient]
  );
}
