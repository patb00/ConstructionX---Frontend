export const vehicleBusinessTripsKeys = {
  all: ["vehicleBusinessTrips"] as const,
  list: (page: number, pageSize: number) =>
    [...vehicleBusinessTripsKeys.all, "list", { page, pageSize }] as const,
  lists: () => [...vehicleBusinessTripsKeys.all, "list"] as const,
  detail: (id: number) =>
    [...vehicleBusinessTripsKeys.all, "detail", id] as const,
  byVehicle: (vehicleId: number) =>
    [...vehicleBusinessTripsKeys.all, "byVehicle", vehicleId] as const,
  byEmployee: (employeeId: number) =>
    [...vehicleBusinessTripsKeys.all, "byEmployee", employeeId] as const,
  hasOpenTrip: (vehicleId: number) =>
    [...vehicleBusinessTripsKeys.all, "hasOpenTrip", vehicleId] as const,
};
