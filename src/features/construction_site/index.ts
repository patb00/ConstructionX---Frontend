export interface ConstructionSiteEmployee {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface ConstructionSiteTool {
  responsibleEmployeeId: number | null | undefined;
  id: number;
  name?: string | null;
  model?: string | null;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  status?: string | null;
  condition?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  responsibleEmployeeName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  description?: string | null;
  category?: string | null;
}

export interface ConstructionSiteVehicle {
  responsibleEmployeeId: number | null | undefined;
  id: number;
  name?: string | null;
  registrationNumber?: string | null;
  vin?: string | null;
  vehicleType?: string | null;
  brand?: string | null;
  model?: string | null;
  yearOfManufacturing?: number | null;
  horsePower?: number | null;
  weight?: number | null;
  averageConsumption?: number | null;
  status?: string | null;
  condition?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  responsibleEmployeeName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  description?: string | null;
}

export interface ConstructionSite {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description: string | null;
  siteManagerId: number | null;
  createdDate: string;
  siteManagerName: string;
  status: number;
  constructionSiteEmployees: ConstructionSiteEmployee[];
  constructionSiteTools: ConstructionSiteTool[];
  constructionSiteVehicles: ConstructionSiteVehicle[];
}

export interface NewConstructionSiteRequest {
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  status: number;
  siteManagerId: number | null;
}

export interface UpdateConstructionSiteRequest {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  siteManagerId: number | null;
}

export interface AssignEmployeeItem {
  employeeId: number;
  dateFrom: string;
  dateTo: string;
}

export interface AssignEmployeesRequest {
  constructionSiteId: number;
  employees: AssignEmployeeItem[];
}

export interface AssignToolItem {
  toolId: number;
  dateFrom: string;
  dateTo: string;
  responsibleEmployeeId: number;
}

export interface AssignToolsRequest {
  constructionSiteId: number;
  tools: AssignToolItem[];
}

export interface AssignVehicleItem {
  vehicleId: number;
  dateFrom: string;
  dateTo: string;
  responsibleEmployeeId: number;
}

export interface AssignVehiclesRequest {
  constructionSiteId: number;
  vehicles: AssignVehicleItem[];
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

export interface GetConstructionSitesQuery {
  startDate?: string;
  plannedEndDate?: string;
  status?: number;
  location?: string;
  siteManagerId?: number;
  employeeId?: number;
  toolId?: number;
  vehicleId?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ChangeConstructionSiteStatusRequest {
  id: number;
  status: number;
}

export interface ConstructionSiteFormValues {
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  siteManagerId: number | null;
  status?: number;
}
