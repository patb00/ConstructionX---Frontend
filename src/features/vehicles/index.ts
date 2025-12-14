export interface Vehicle {
  id: number;
  name: string;
  registrationNumber: string | null;
  vin: string | null;
  brand: string | null;
  model: string | null;
  yearOfManufacturing: number | null;
  vehicleType: string | null;
  status: string | null;
  purchaseDate: string;
  purchasePrice: number;
  description: string | null;
  condition: string | null;
  horsePower: number | null;
  averageConsumption: number | null;
  weight: number | null;
}

export interface NewVehicleRequest {
  name: string;
  registrationNumber?: string | null;
  vin?: string | null;
  brand?: string | null;
  model?: string | null;
  yearOfManufacturing?: number | null;
  vehicleType?: string | null;
  status?: string | null;
  purchaseDate: string;
  purchasePrice: number;
  description?: string | null;
  condition?: string | null;
  horsePower?: number | null;
  averageConsumption?: number | null;
  weight?: number | null;
}

export interface UpdateVehicleRequest extends NewVehicleRequest {
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
