export const toolCategoriesKeys = {
  all: ["tool-categories"] as const,
  list: () => [...toolCategoriesKeys.all, "list"] as const,
  detail: (id: number) => [...toolCategoriesKeys.all, "detail", id] as const,
};
