import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CompaniesApi } from "../api/companies.api";
import { companiesKeys } from "../api/companies.keys";

export function useDeleteCompany() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (companyId: number) => CompaniesApi.delete(companyId),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: companiesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
