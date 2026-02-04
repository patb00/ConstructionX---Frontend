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

export type { PagedResult } from "../../shared/types/api";

export interface GetCondosQuery {
  page?: number;
  pageSize?: number;
}

export interface AssignCondoEmployeeItem {
  employeeId: number;
  dateFrom: string;
  dateTo: string;
}

export interface AssignEmployeesToCondoRequest {
  condoId: number;
  employees: AssignCondoEmployeeItem[];
}

export interface CondoEmployee {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface CondoConstructionSite {
  id: number;
  name: string;
  location?: string | null;
  startDate?: string | null;
  plannedEndDate?: string | null;
  description?: string | null;
  status?: number | null;
}

export interface CondoDetails extends Condo {
  responsibleEmployeeName?: string | null;
  responsibleEmployeeJobPosition?: string | null;

  employees: CondoEmployee[];
  constructionSites: CondoConstructionSite[];

  createdDate?: string | null;
  createdBy?: string | null;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}
