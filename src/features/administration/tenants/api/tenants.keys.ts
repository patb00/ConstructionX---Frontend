export const tenantsKeys = {
  all: ["tenants"] as const,
  list: () => [...tenantsKeys.all, "list"] as const,
  detail: (id: string) => [...tenantsKeys.all, "detail", id] as const,
};
