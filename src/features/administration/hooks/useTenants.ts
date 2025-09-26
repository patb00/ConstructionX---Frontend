import { useQuery } from "@tanstack/react-query";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";

export function useTenants() {
  return useQuery({
    queryKey: tenantsKeys.list(),
    queryFn: () => TenantsApi.getAll(),
    staleTime: 60_000,
  });
}
