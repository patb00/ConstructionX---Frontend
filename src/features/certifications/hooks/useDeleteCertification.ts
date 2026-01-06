import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CertificationsApi } from "../api/certifications.api";
import { certificationsKeys } from "../api/certifications.keys";

export function useDeleteCertification() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (certificationId: number) =>
      CertificationsApi.delete(certificationId),

    onSuccess: (data: any, certificationId) => {
      qc.invalidateQueries({ queryKey: certificationsKeys.lists() });
      qc.invalidateQueries({
        queryKey: certificationsKeys.detail(certificationId),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
