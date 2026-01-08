import { useMemo } from "react";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { useEmployees } from "../features/administration/employees/hooks/useEmployees";

export function useSession() {
  const { userId, role } = useAuthStore();
  const { employeeRows = [] } = useEmployees();

  const isAdmin = role === "Admin";

  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  return { userId, role, isAdmin, myEmployeeId };
}
