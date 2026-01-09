export const vehicleRepairsKeys = {
  all: ["vehicle-repairs"] as const,

  list: (page: number, pageSize: number) =>
    [...vehicleRepairsKeys.all, "list", { page, pageSize }] as const,

  lists: () => [...vehicleRepairsKeys.all, "list"] as const,

  detail: (id: number) => [...vehicleRepairsKeys.all, "detail", id] as const,

  byVehicle: (vehicleId: number, page: number, pageSize: number) =>
    [
      ...vehicleRepairsKeys.all,
      "by-vehicle",
      { vehicleId, page, pageSize },
    ] as const,
};
