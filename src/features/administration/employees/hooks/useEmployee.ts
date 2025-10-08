import { useQuery } from "@tanstack/react-query";
import { employeesKeys } from "../api/employees.keys";
import { EmployeesApi } from "../api/employees.api";
import type { Employee } from "..";

export function useEmployee(employeeId: number) {
  return useQuery<Employee>({
    queryKey: employeesKeys.detail(employeeId),
    queryFn: () => EmployeesApi.getById(employeeId),
  });
}
