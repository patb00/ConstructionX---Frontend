export const vehicleBusinessTripsKeys = {
  all: ["vehicleBusinessTrips"] as const,
  list: (page: number, pageSize: number, tripStatus?: number) =>
    [
      ...vehicleBusinessTripsKeys.all,
      "list",
      { page, pageSize, tripStatus },
    ] as const,
  lists: () => [...vehicleBusinessTripsKeys.all, "list"] as const,
  detail: (id: number) =>
    [...vehicleBusinessTripsKeys.all, "detail", id] as const,
  byVehicle: (vehicleId: number) =>
    [...vehicleBusinessTripsKeys.all, "byVehicle", vehicleId] as const,
  byEmployee: (employeeId: number) =>
    [...vehicleBusinessTripsKeys.all, "byEmployee", employeeId] as const,
  isVehicleAvailable: (
    vehicleId: number,
    startAt: string,
    endAt: string,
    excludeTripId?: number
  ) =>
    [
      ...vehicleBusinessTripsKeys.all,
      "isVehicleAvailable",
      { vehicleId, startAt, endAt, excludeTripId },
    ] as const,
};
