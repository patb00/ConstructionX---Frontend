export const usersKeys = {
  all: ["users"] as const,
  list: () => [...usersKeys.all, "list"] as const,
  detail: (userId: string) => [...usersKeys.all, "detail", userId] as const,
  permissions: (userId: string) =>
    [...usersKeys.all, "permissions", userId] as const,
  roles: (userId: string) => [...usersKeys.all, "roles", userId] as const,
  mePermissions: () => [...usersKeys.all, "me", "permissions"] as const,
};
