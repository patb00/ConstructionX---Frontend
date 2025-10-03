import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../api/roles.keys";
import { RolesApi } from "../api/roles.api";

export function usePermissions() {
  return useQuery({
    queryKey: rolesKeys.permissions(),
    queryFn: () => RolesApi.getAllPermissions(),
  });
}
