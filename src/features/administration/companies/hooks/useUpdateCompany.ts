import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CompaniesApi } from "../api/companies.api";
import { companiesKeys } from "../api/companies.keys";
import type { UpdateCompanyRequest } from "..";
import { useNavigate } from "react-router-dom";

export function useUpdateCompany() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: UpdateCompanyRequest) => CompaniesApi.update(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: companiesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/administration/companies");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
