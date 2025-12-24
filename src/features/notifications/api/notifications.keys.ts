export const notificationsKeys = {
  all: ["notifications"] as const,

  my: (includeRead: boolean, page: number, pageSize: number) =>
    [...notificationsKeys.all, "my", { includeRead, page, pageSize }] as const,
  myList: () => [...notificationsKeys.all, "my"] as const,

  unread: (take: number) =>
    [...notificationsKeys.all, "my-unread", { take }] as const,
  unreadList: () => [...notificationsKeys.all, "my-unread"] as const,
};
