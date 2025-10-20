export const vehiclesKeys = {
  all: ["vehicles"] as const,
  list: () => [...vehiclesKeys.all, "list"] as const,
  detail: (id: number) => [...vehiclesKeys.all, "detail", id] as const,
};
