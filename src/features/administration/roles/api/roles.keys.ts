export const rolesKeys = {
  all: ["roles"] as const,
  list: () => [...rolesKeys.all, "list"] as const,
  partial: (id: string) => [...rolesKeys.all, "partial", id] as const,
  full: (id: string) => [...rolesKeys.all, "full", id] as const,
  permissions: () => [...rolesKeys.all, "permissions"] as const,
};
