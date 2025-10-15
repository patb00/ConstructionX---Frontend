import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { NewEmployeeRequest } from "..";
import { EmployeesApi } from "../api/employees.api";
import { companiesKeys } from "../../companies/api/companies.keys";

export function useAddEmployee() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewEmployeeRequest) => EmployeesApi.add(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: companiesKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
