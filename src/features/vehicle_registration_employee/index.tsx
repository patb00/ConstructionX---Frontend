export interface VehicleRegistrationEmployee {
  id: number;
  vehicleId: number;
  employeeId: number;
  expiresOn: string;
  vehicleRegistrationId: number;
  status: number;
  note?: string | null;
  completedAt?: string | null;
}

export interface AddVehicleRegistrationEmployeeRequest {
  vehicleId: number;
  employeeId: number;
  expiresOn: string;
  vehicleRegistrationId: number;
  status: number;
  note?: string | null;
}

export interface UpdateVehicleRegistrationEmployeeRequest {
  id: number;
  vehicleId: number;
  employeeId: number;
  expiresOn: string;
  vehicleRegistrationId: number;
  status: number;
  note?: string | null;
  completedAt?: string | null;
}

export interface GetVehicleRegistrationEmployeesQuery {
  page?: number;
  pageSize?: number;
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
