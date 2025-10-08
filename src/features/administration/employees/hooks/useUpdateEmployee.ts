import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { UpdateEmployeeRequest } from "..";
import { EmployeesApi } from "../api/employees.api";
import { employeesKeys } from "../api/employees.keys";
import { useNavigate } from "react-router-dom";

export function useUpdateEmployee() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateEmployeeRequest) =>
      EmployeesApi.update(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: employeesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });

      navigate("/app/administration/employees");
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
