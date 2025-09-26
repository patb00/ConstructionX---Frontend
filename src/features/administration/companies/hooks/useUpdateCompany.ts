import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CompaniesApi } from "../api/companies.api";
import { companiesKeys } from "../api/companies.keys";
import type { UpdateCompanyRequest } from "..";

export function useUpdateCompany() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateCompanyRequest) => CompaniesApi.update(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: companiesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
