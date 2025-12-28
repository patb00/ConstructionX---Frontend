export const vehicleInsurancesKeys = {
  all: ["vehicleInsurances"] as const,
  list: (page: number, pageSize: number) =>
    [...vehicleInsurancesKeys.all, "list", { page, pageSize }] as const,
  lists: () => [...vehicleInsurancesKeys.all, "list"] as const,
  detail: (id: number) => [...vehicleInsurancesKeys.all, "detail", id] as const,
  byVehicle: (vehicleId: number) =>
    [...vehicleInsurancesKeys.all, "byVehicle", vehicleId] as const,
};
