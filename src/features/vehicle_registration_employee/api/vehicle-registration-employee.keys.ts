export const vehicleRegistrationEmployeesKeys = {
  all: ["vehicle-registration-employees"] as const,
  list: (query?: { page?: number; pageSize?: number }) =>
    [...vehicleRegistrationEmployeesKeys.all, "list", query] as const,
  detail: (id: number) =>
    [...vehicleRegistrationEmployeesKeys.all, "detail", id] as const,
  byVehicle: (vehicleId: number) =>
    [...vehicleRegistrationEmployeesKeys.all, "by-vehicle", vehicleId] as const,
  byEmployee: (employeeId: number) =>
    [
      ...vehicleRegistrationEmployeesKeys.all,
      "by-employee",
      employeeId,
    ] as const,
};
