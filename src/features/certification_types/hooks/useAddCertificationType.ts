import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewCertificationTypeRequest } from "..";
import { CertificationTypesApi } from "../api/certification-types.api";
import { certificationTypesKeys } from "../api/certification-types.keys";

export function useAddCertificationType() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewCertificationTypeRequest) =>
      CertificationTypesApi.add(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: certificationTypesKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/certificationTypes");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
