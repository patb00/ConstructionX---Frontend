import { useMemo } from "react";
import { useRoles } from "../../administration/roles/hooks/useRoles";

export type RoleOption = { label: string; value: string };

export function useRoleOptions() {
  const { rolesRows, isLoading, error } = useRoles();

  const roleOptions: RoleOption[] = useMemo(
    () => (rolesRows ?? []).map((r: any) => ({ label: r.name, value: r.id })),
    [rolesRows]
  );

  return { roleOptions, rolesRows, isLoading, error };
}
