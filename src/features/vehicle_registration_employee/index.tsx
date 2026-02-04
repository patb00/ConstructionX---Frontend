export interface VehicleRegistrationEmployee {
  id: number;
  vehicleId: number;
  employeeId: number;
  employeeName: string | null;
  vehicleRegistrationNumber: string | null;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  registrationValidFrom: string | null;
  registrationValidTo: string | null;
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

export type { PagedResult } from "../../shared/types/api";
