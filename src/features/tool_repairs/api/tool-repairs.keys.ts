export const toolRepairsKeys = {
  all: ["tool-repairs"] as const,
  list: (toolId: number, page: number, pageSize: number) =>
    [...toolRepairsKeys.all, "list", toolId, { page, pageSize }] as const,
  listAll: (page: number, pageSize: number) =>
    [...toolRepairsKeys.all, "list-all", { page, pageSize }] as const,
  lists: () => toolRepairsKeys.all,
  detail: (id: number) => [...toolRepairsKeys.all, "detail", id] as const,
};
