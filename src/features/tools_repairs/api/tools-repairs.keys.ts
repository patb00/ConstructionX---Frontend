export const toolRepairsKeys = {
  all: ["tool-repairs"] as const,

  list: (page: number, pageSize: number) =>
    [...toolRepairsKeys.all, "list", { page, pageSize }] as const,

  lists: () => [...toolRepairsKeys.all, "list"] as const,

  detail: (id: number) => [...toolRepairsKeys.all, "detail", id] as const,

  byTool: (toolId: number, page: number, pageSize: number) =>
    [...toolRepairsKeys.all, "by-tool", { toolId, page, pageSize }] as const,
};
