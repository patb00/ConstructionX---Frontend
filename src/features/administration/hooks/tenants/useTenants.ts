import { useQuery } from "@tanstack/react-query";
import { TenantsApi } from "../../api/tenants/tenants.api";
import { tenantsKeys } from "../../api/tenants/tenants.keys";

export function useTenants() {
  return useQuery({
    queryKey: tenantsKeys.list(),
    queryFn: () => TenantsApi.getAll(),
  });
}
