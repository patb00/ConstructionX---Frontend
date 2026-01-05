import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CertificationTypesApi } from "../api/certification-types.api";
import { certificationTypesKeys } from "../api/certification-types.keys";

export function useDeleteCertificationType() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (certificationTypeId: number) =>
      CertificationTypesApi.delete(certificationTypeId),

    onSuccess: (data: any, certificationTypeId) => {
      qc.invalidateQueries({ queryKey: certificationTypesKeys.list() });
      qc.invalidateQueries({
        queryKey: certificationTypesKeys.detail(certificationTypeId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
