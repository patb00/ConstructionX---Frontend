import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import type { NewCertificationRequest } from "..";
import { CertificationsApi } from "../api/certifications.api";
import { certificationsKeys } from "../api/certifications.keys";

export function useAddCertification() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewCertificationRequest) =>
      CertificationsApi.add(payload),

    onSuccess: (data: any) => {
      console.log(data);
      qc.invalidateQueries({ queryKey: certificationsKeys.lists() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
