import { useQuery } from "@tanstack/react-query";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";

export function useTenant(id?: string) {
  return useQuery({
    queryKey: id ? tenantsKeys.detail(id) : tenantsKeys.detail("nil"),
    queryFn: () => {
      if (!id) throw new Error("Missing tenant id");
      return TenantsApi.getById(id);
    },
    enabled: !!id,
  });
}
