export const condosKeys = {
  all: ["condos"] as const,
  list: () => [...condosKeys.all, "list"] as const,
  detail: (id: number) => [...condosKeys.all, "detail", id] as const,
};
