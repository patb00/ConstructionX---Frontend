export interface VehicleBusinessTrip {
  id: number;
  vehicleId: number;
  employeeId: number;
  startLocationText: string | null;
  endLocationText: string | null;
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
  vehicleId: number;
  employeeId: number;
  startLocationText?: string | null;
  endLocationText?: string | null;
  startAt: string;
  endAt: string;
  startKilometers: number;
  endKilometers: number;
  refueled: boolean;
  fuelAmount: number;
  fuelCurrency?: string | null;
  fuelLiters: number;
  note?: string | null;
}

export interface UpdateVehicleBusinessTripRequest {
  id: number;
  startLocationText?: string | null;
  endLocationText?: string | null;
  startAt: string;
  endAt: string;
  startKilometers: number;
  endKilometers: number;
  tripStatus: number;
  refueled: boolean;
  fuelAmount: number;
  fuelCurrency?: string | null;
  fuelLiters: number;
  note?: string | null;
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
