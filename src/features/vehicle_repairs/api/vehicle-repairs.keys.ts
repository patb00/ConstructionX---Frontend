export const vehicleRepairsKeys = {
  all: ["vehicle-repairs"] as const,
  list: (vehicleId: number, page: number, pageSize: number) =>
    [...vehicleRepairsKeys.all, "list", vehicleId, { page, pageSize }] as const,
  listAll: (page: number, pageSize: number) =>
    [...vehicleRepairsKeys.all, "list-all", { page, pageSize }] as const,
  lists: () => vehicleRepairsKeys.all,
  detail: (id: number) => [...vehicleRepairsKeys.all, "detail", id] as const,
};
