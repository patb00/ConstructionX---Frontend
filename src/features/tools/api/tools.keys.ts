export const toolsKeys = {
  all: ["tools"] as const,
  list: () => [...toolsKeys.all, "list"] as const,
  detail: (id: number) => [...toolsKeys.all, "detail", id] as const,
};
