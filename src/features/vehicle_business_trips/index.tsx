export interface VehicleBusinessTrip {
  id: number;
  vehicleId: number;
  employeeId: number;
  employeeName: string | null;
  vehicleRegistrationNumber: string | null;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  approvedByEmployeeName: string | null;
  startLocationText: string | null;
  endLocationText: string | null;
  purposeOfTrip: string | null;
  startAt: string;
  endAt: string;
  startKilometers: number;
  endKilometers: number;
  tripStatus: number | null;
  refueled: boolean;
  fuelAmount: number;
  fuelCurrency: string | null;
  fuelLiters: number;
  note: string | null;
}

export interface NewVehicleBusinessTripRequest {
  employeeId: number;
  startLocationText?: string | null;
  endLocationText?: string | null;
  purposeOfTrip?: string | null;
  startAt: string;
  endAt: string;
}

export interface UpdateVehicleBusinessTripRequest {
  id: number;
  startLocationText?: string | null;
  endLocationText?: string | null;
  purposeOfTrip?: string | null;
  startAt: string;
  endAt: string;
}

export interface ApproveVehicleBusinessTripRequest {
  tripId: number;
  vehicleId: number;
  approvedByEmployeeUserId: string;
}

export interface RejectVehicleBusinessTripRequest {
  tripId: number;
  rejectReason: string;
  approvedByEmployeeUserId: string;
}

export interface CancelVehicleBusinessTripRequest {
  tripId: number;
  cancelReason: string;
  cancelledByEmployeeUserId: string;
}

export interface CompleteVehicleBusinessTripRequest {
  tripId: number;
  startKilometers: number;
  endKilometers: number;
  refueled: boolean;
  fuelAmount: number | null;
  fuelCurrency: string | null;
  fuelLiters: number | null;
  note: string | null;
}

export type { PagedResult } from "../../shared/types/api";
