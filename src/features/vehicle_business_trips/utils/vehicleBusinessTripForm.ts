import type { VehicleBusinessTrip, UpdateVehicleBusinessTripRequest } from "..";

export function vehicleBusinessTripToDefaultValues(
  trip?: VehicleBusinessTrip | null
): UpdateVehicleBusinessTripRequest | undefined {
  if (!trip) return undefined;

  return {
    vehicleId: trip.vehicleId,
    employeeId: trip.employeeId,
    startLocationText: trip.startLocationText ?? "",
    endLocationText: trip.endLocationText ?? "",
    startAt: trip.startAt,
    endAt: trip.endAt,
    startKilometers: trip.startKilometers ?? 0,
    endKilometers: trip.endKilometers ?? 0,

    tripStatus: (trip.tripStatus ?? 1) as any,

    refueled: !!trip.refueled,
    fuelAmount: trip.fuelAmount ?? 0,
    fuelCurrency: trip.fuelCurrency ?? "",
    fuelLiters: trip.fuelLiters ?? 0,
    note: trip.note ?? "",
  } as any;
}
