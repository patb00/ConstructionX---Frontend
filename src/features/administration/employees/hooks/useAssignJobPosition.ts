import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { AssignJobPositionRequest } from "..";
import { EmployeesApi } from "../api/employees.api";
import { employeesKeys } from "../api/employees.keys";

export function useAssignJobPosition() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: AssignJobPositionRequest) =>
      EmployeesApi.assignJobPosition(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: employeesKeys.lists() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
