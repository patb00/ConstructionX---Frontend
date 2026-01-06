export const vehicleRepairsKeys = {
  all: ["vehicle-repairs"] as const,
  list: (vehicleId: number, page: number, pageSize: number) =>
    [...vehicleRepairsKeys.all, "list", vehicleId, { page, pageSize }] as const,
  lists: () => [...vehicleRepairsKeys.all, "list"] as const,
  detail: (id: number) => [...vehicleRepairsKeys.all, "detail", id] as const,
};
