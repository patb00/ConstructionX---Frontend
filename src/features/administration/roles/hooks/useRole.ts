import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../api/roles.keys";
import { RolesApi } from "../api/roles.api";

export function useRole(roleId?: string) {
  return useQuery({
    queryKey: roleId ? rolesKeys.partial(roleId) : rolesKeys.partial("nil"),
    queryFn: () => {
      if (!roleId) throw new Error("Missing tenant id");
      return RolesApi.getPartial(roleId);
    },
    enabled: !!roleId,
  });
}
