import type { CreateVehicleRepairRequest, VehicleRepair } from "..";

export function vehicleRepairToDefaultValues(
  repair?: VehicleRepair | null
): CreateVehicleRepairRequest | undefined {
  if (!repair) return undefined;

  return {
    vehicleId: repair.vehicleId,
    repairDate: repair.repairDate,
    cost: repair.cost,
    condition: repair.condition ?? "",
    description: repair.description ?? null,
  };
}
