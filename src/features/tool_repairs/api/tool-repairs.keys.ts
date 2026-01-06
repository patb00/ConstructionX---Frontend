export const toolRepairsKeys = {
  all: ["tool-repairs"] as const,
  list: (toolId: number, page: number, pageSize: number) =>
    [...toolRepairsKeys.all, "list", toolId, { page, pageSize }] as const,
  lists: () => [...toolRepairsKeys.all, "list"] as const,
  detail: (id: number) => [...toolRepairsKeys.all, "detail", id] as const,
};
