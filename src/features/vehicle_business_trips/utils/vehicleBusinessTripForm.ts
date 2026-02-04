import type { VehicleBusinessTrip, UpdateVehicleBusinessTripRequest } from "..";

export function vehicleBusinessTripToDefaultValues(
  trip?: VehicleBusinessTrip | null
): UpdateVehicleBusinessTripRequest | undefined {
  if (!trip) return undefined;

  return {
    id: trip.id,
    startLocationText: trip.startLocationText ?? "",
    endLocationText: trip.endLocationText ?? "",
    purposeOfTrip: (trip as any).purposeOfTrip ?? "",
    startAt: trip.startAt,
    endAt: trip.endAt,
  };
}
