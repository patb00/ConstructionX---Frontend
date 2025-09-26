import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { CompaniesApi } from "../api/companies.api";
import { companiesKeys } from "../api/companies.keys";
import type { NewCompanyRequest } from "..";

export function useAddCompany() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewCompanyRequest) => CompaniesApi.add(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: companiesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });

      navigate("/app/administration/companies");
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
