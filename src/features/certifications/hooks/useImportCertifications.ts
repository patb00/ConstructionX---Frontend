import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CertificationsApi } from "../api/certifications.api";
import { certificationsKeys } from "../api/certifications.keys";

export function useImportCertifications() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await CertificationsApi.import(file);
      await queryClient.invalidateQueries({ queryKey: certificationsKeys.all });
      return result;
    },
    [queryClient]
  );
}
