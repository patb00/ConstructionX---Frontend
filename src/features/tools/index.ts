import type { ReactNode } from "react";

export interface Tool {
  id: number;
  name: string;
  inventoryNumber: string | null;
  serialNumber: string | null;
  manufacturer: string | null;
  model: string | null;
  purchaseDate: string;
  purchasePrice: number;
  status: string | null;
  condition: string | null;
  description: string | null;
  toolCategoryId: number;
  responsibleEmployeeId: number | null;
}

export interface NewToolRequest {
  name: string;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  purchaseDate: string;
  purchasePrice: number;
  status?: string | null;
  condition?: string | null;
  description?: string | null;
  toolCategoryId: number;
  responsibleEmployeeId?: number | null;
}

export interface UpdateToolRequest {
  id: number;
  name: string;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  purchaseDate: string;
  purchasePrice: number;
  status?: string | null;
  condition?: string | null;
  description?: string | null;
  toolCategoryId: number;
  responsibleEmployeeId?: number | null;
}

export type { PagedResult } from "../../shared/types/api";

export interface ToolHistoryItem {
  dateTo: string | null;
  responsibleEmployeeId: ReactNode;
  responsibleEmployeeName: ReactNode;
  constructionSiteId: any;
  dateFrom: string | undefined;
  constructionSiteLocation: string | undefined;
  constructionSiteName: string;
  id: number;
  toolId: number;
  action: string;
  changedAt: string;
  changedByEmployeeId?: number | null;
}
