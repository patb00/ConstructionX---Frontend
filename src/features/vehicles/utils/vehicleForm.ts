import type { NewVehicleRequest } from "..";

const toYMD = (s?: string | null) => (s ? s.slice(0, 10) : "");

export function vehicleToDefaultValues(
  vehicle: any | null | undefined
): NewVehicleRequest | undefined {
  if (!vehicle) return undefined;

  return {
    name: vehicle.name ?? "",
    registrationNumber: vehicle.registrationNumber ?? null,
    vin: vehicle.vin ?? null,
    brand: vehicle.brand ?? null,
    model: vehicle.model ?? null,
    yearOfManufacturing: vehicle.yearOfManufacturing ?? null,
    vehicleType: vehicle.vehicleType ?? null,
    status: vehicle.status ?? null,
    purchaseDate: toYMD(vehicle.purchaseDate),
    purchasePrice:
      typeof vehicle.purchasePrice === "number" ? vehicle.purchasePrice : 0,
    description: vehicle.description ?? null,
    condition: vehicle.condition ?? null,
    horsePower: vehicle.horsePower ?? null,
    averageConsumption: vehicle.averageConsumption ?? null,
    weight: vehicle.weight ?? null,
  };
}
