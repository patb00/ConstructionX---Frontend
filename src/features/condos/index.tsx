export interface Condo {
  id: number;
  address: string;
  capacity: number;
  currentlyOccupied: number;
  leaseStartDate: string;
  leaseEndDate: string;
  notes: string | null;
  responsibleEmployeeId: number;
  pricePerDay: number;
  pricePerMonth: number;
  currency: string;
}

export interface NewCondoRequest {
  address: string;
  capacity: number;
  currentlyOccupied: number;
  leaseStartDate: string;
  leaseEndDate: string;
  notes?: string | null;
  responsibleEmployeeId: number;
  pricePerDay: number;
  pricePerMonth: number;
  currency: string;
}

export interface UpdateCondoRequest {
  id: number;
  address: string;
  capacity: number;
  currentlyOccupied: number;
  leaseStartDate: string;
  leaseEndDate: string;
  notes?: string | null;
  responsibleEmployeeId: number;
  pricePerDay: number;
  pricePerMonth: number;
  currency: string;
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

export interface GetCondosQuery {
  page?: number;
  pageSize?: number;
}
