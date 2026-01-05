import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateCertificationRequest } from "..";
import { CertificationsApi } from "../api/certifications.api";
import { certificationsKeys } from "../api/certifications.keys";

export function useUpdateCertification() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateCertificationRequest) =>
      CertificationsApi.update(payload),

    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({ queryKey: certificationsKeys.lists() });
      qc.invalidateQueries({
        queryKey: certificationsKeys.detail(variables.id),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/certifications");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
