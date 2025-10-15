import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { EmployeesApi } from "../api/employees.api";
import { employeesKeys } from "../api/employees.keys";

export function useDeleteEmployee() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (employeeId: number) => EmployeesApi.delete(employeeId),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: employeesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
