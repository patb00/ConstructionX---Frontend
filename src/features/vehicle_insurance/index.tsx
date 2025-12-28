export interface VehicleInsurance {
  id: number;
  vehicleId: number;
  insurer: string | null;
  policyNumber: string | null;
  policyType: number | null;
  costAmount: number;
  costCurrency: string | null;
  validFrom: string;
  validTo: string;
  documentPath: string | null;
}

export interface NewVehicleInsuranceRequest {
  vehicleId: number;
  insurer?: string | null;
  policyNumber?: string | null;
  policyType?: number | null;
  costAmount: number;
  costCurrency?: string | null;
  validFrom: string;
  validTo: string;
  documentPath?: string | null;
}

export interface UpdateVehicleInsuranceRequest
  extends NewVehicleInsuranceRequest {
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
