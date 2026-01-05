import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateCertificationTypeRequest } from "..";
import { CertificationTypesApi } from "../api/certification-types.api";
import { certificationTypesKeys } from "../api/certification-types.keys";

export function useUpdateCertificationType() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateCertificationTypeRequest) =>
      CertificationTypesApi.update(payload),

    onSuccess: (data: any, variables) => {
      qc.invalidateQueries({ queryKey: certificationTypesKeys.list() });
      qc.invalidateQueries({
        queryKey: certificationTypesKeys.detail(variables.id),
      });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/certificationTypes");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
