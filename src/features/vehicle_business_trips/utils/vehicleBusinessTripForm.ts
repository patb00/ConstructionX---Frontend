import type { NewVehicleBusinessTripRequest, VehicleBusinessTrip } from "..";

export function vehicleBusinessTripToDefaultValues(
  trip?: VehicleBusinessTrip | null
): Partial<NewVehicleBusinessTripRequest> | undefined {
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
    refueled: !!trip.refueled,
    fuelAmount: trip.fuelAmount ?? 0,
    fuelCurrency: trip.fuelCurrency ?? "",
    fuelLiters: trip.fuelLiters ?? 0,
    note: trip.note ?? "",
  };
}
