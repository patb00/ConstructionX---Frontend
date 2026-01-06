export interface VehicleRepair {
  id: number;
  vehicleId: number;
  name: string;
  registrationNumber: string;
  model: string;
  yearOfManufacturing: number;
  vehicleType: string | null;
  horsePower: number | null;
  repairDate: string;
  cost: number;
  condition: string;
  description: string | null;
}

export interface CreateVehicleRepairRequest {
  vehicleId: number;
  repairDate: string;
  cost: number;
  condition: string;
  description?: string | null;
}

export interface UpdateVehicleRepairRequest extends CreateVehicleRepairRequest {
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
