export const materialsKeys = {
  all: ["materials"] as const,
  list: (page: number, pageSize: number) =>
    [...materialsKeys.all, "list", { page, pageSize }] as const,
  lists: () => [...materialsKeys.all, "list"] as const,
  detail: (id: number) => [...materialsKeys.all, "detail", id] as const,
};
