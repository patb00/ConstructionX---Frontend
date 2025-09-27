import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../api/roles.keys";
import { RolesApi } from "../api/roles.api";

export function useRolesFull(roleId: string) {
  return useQuery({
    queryKey: rolesKeys.full(roleId),
    queryFn: () => RolesApi.getFull(roleId),
  });
}
