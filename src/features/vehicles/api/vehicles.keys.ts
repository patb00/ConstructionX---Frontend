export const vehiclesKeys = {
  all: ["vehicles"] as const,
  list: (page: number, pageSize: number) =>
    [...vehiclesKeys.all, "list", { page, pageSize }] as const,
  detail: (id: number) => [...vehiclesKeys.all, "detail", id] as const,
};
