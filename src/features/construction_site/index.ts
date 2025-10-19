export interface ConstructionSite {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description: string | null;
  siteManagerId: number | null;
}

export interface NewConstructionSiteRequest {
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
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
