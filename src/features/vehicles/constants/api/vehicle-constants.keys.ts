export const vehicleConstantsKeys = {
  all: ["vehicle-constants"] as const,
  statuses: () => [...vehicleConstantsKeys.all, "statuses"] as const,
  conditions: () => [...vehicleConstantsKeys.all, "conditions"] as const,
  types: () => [...vehicleConstantsKeys.all, "types"] as const,
};
