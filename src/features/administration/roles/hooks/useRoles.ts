import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../api/roles.keys";
import { RolesApi } from "../api/roles.api";

export function useRoles() {
  return useQuery({
    queryKey: rolesKeys.list(),
    queryFn: () => RolesApi.getAll(),
  });
}
