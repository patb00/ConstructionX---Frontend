export const companiesKeys = {
  all: ["companies"] as const,
  list: () => [...companiesKeys.all, "list"] as const,
  detail: (id: number | string) =>
    [...companiesKeys.all, "detail", id] as const,
  byName: (name: string) => [...companiesKeys.all, "name", name] as const,
};
