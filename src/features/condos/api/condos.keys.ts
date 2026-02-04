export const condosKeys = {
  all: ["condos"] as const,
  list: (query?: any) => [...condosKeys.all, "list", query] as const,
  detail: (id: number) => [...condosKeys.all, "detail", id] as const,
};
