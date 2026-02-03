import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { EmployeesApi } from "../api/employees.api";
import { employeesKeys } from "../api/employees.keys";

export function useImportEmployees() {
  const queryClient = useQueryClient();

  return useCallback(
    async (file: File) => {
      const result = await EmployeesApi.import(file);
      await queryClient.invalidateQueries({ queryKey: employeesKeys.all });
      return result;
    },
    [queryClient]
  );
}
