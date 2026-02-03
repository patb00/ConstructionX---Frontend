import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CertificationTypesApi } from "../api/certification-types.api";
import { certificationTypesKeys } from "../api/certification-types.keys";

export function useImportCertificationTypes() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await CertificationTypesApi.import(file);
      await queryClient.invalidateQueries({ queryKey: certificationTypesKeys.all });
      return result;
    },
    [queryClient]
  );
}
