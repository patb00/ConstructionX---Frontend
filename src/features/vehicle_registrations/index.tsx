export interface VehicleRegistration {
  id: number;
  vehicleId: number;

  validFrom: string;
  validTo: string;

  totalCostAmount: number;
  costCurrency: string | null;

  registrationStationName: string | null;
  registrationStationLocation: string | null;

  reportNumber: string | null;
  documentPath: string | null;
  note: string | null;
}

export interface NewVehicleRegistrationRequest {
  vehicleId: number;
  validFrom: string;
  validTo: string;
  totalCostAmount: number;
  costCurrency?: string | null;
  registrationStationName?: string | null;
  registrationStationLocation?: string | null;
  reportNumber?: string | null;
  documentPath?: string | null;
  note?: string | null;
}

export interface UpdateVehicleRegistrationRequest
  extends NewVehicleRegistrationRequest {
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
