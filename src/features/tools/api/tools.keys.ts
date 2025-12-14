export const toolsKeys = {
  all: ["tools"] as const,
  list: (page: number, pageSize: number) =>
    [...toolsKeys.all, "list", { page, pageSize }] as const,
  detail: (id: number) => [...toolsKeys.all, "detail", id] as const,
};
