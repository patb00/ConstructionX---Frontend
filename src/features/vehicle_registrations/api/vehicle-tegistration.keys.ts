export const vehicleRegistrationsKeys = {
  all: ["vehicle-registrations"] as const,

  list: (page: number, pageSize: number) =>
    [...vehicleRegistrationsKeys.all, "list", { page, pageSize }] as const,

  lists: () => [...vehicleRegistrationsKeys.all, "list"] as const,

  detail: (id: number) =>
    [...vehicleRegistrationsKeys.all, "detail", id] as const,

  byVehicle: (vehicleId: number) =>
    [...vehicleRegistrationsKeys.all, "by-vehicle", vehicleId] as const,
};
