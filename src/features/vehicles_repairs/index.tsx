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

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
