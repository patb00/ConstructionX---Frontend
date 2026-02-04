import { useMemo } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

export const useCurrentEmployeeContext = () => {
  const { userId, role } = useAuthStore();
  const isAdmin = role === "Admin";
  const { employeeRows = [] } = useEmployees();

  const employee = useMemo(() => {
    if (!userId) return null;
    return employeeRows.find((row: any) => row.applicationUserId === userId);
  }, [employeeRows, userId]);

  const employeeId = employee?.id ?? null;

  return {
    userId,
    role,
    isAdmin,
    employee,
    employeeId,
  };
};
