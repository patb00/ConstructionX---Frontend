import type { VehicleRepair, NewVehicleRepairRequest } from "..";

export function vehicleRepairToDefaultValues(
  r?: VehicleRepair
): NewVehicleRepairRequest | undefined {
  if (!r) return undefined;

  return {
    vehicleId: r.vehicleId,
    repairDate: r.repairDate,
    cost: r.cost,
    condition: r.condition ?? null,
    description: r.description ?? null,
  };
}
