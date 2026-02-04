export interface VehicleRepair {
  id: number;
  vehicleId: number;
  repairDate: string;
  cost: number;
  condition: string | null;
  description: string | null;
  name?: string | null;
  registrationNumber?: string | null;
  vin?: string | null;
  brand?: string | null;
}

export interface NewVehicleRepairRequest {
  vehicleId: number;
  repairDate: string;
  cost: number;
  condition?: string | null;
  description?: string | null;
}

export interface UpdateVehicleRepairRequest extends NewVehicleRepairRequest {
  id: number;
}

export type { PagedResult } from "../../shared/types/api";
