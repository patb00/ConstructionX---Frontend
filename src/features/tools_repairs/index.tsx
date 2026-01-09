export interface ToolRepair {
  id: number;
  toolId: number;
  repairDate: string;
  cost: number;
  condition: string | null;
  description: string | null;
}

export interface NewToolRepairRequest {
  toolId: number;
  repairDate: string;
  cost: number;
  condition?: string | null;
  description?: string | null;
}

export interface UpdateToolRepairRequest extends NewToolRepairRequest {
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
