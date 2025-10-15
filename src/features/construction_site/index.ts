export interface ConstructionSite {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description: string | null;
  siteManagerId: number;
}

export interface NewConstructionSiteRequest {
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  siteManagerId: number;
}

export interface UpdateConstructionSiteRequest {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  siteManagerId: number;
}
