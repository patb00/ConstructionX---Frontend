import type { VehicleRegistration, NewVehicleRegistrationRequest } from "..";

export function vehicleRegistrationToDefaultValues(
  r?: VehicleRegistration
): NewVehicleRegistrationRequest | undefined {
  if (!r) return undefined;

  return {
    vehicleId: r.vehicleId,
    validFrom: r.validFrom,
    validTo: r.validTo,
    totalCostAmount: r.totalCostAmount,
    costCurrency: r.costCurrency ?? null,
    registrationStationName: r.registrationStationName ?? null,
    registrationStationLocation: r.registrationStationLocation ?? null,
    reportNumber: r.reportNumber ?? null,
    documentPath: r.documentPath ?? null,
    note: r.note ?? null,
  };
}
