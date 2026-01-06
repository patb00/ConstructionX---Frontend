export interface ToolRepair {
  id: number;
  toolId: number;
  name: string;
  inventoryNumber: string;
  serialNumber: string | null;
  manufacturer: string;
  model: string | null;
  repairDate: string;
  cost: number;
  condition: string;
  description: string | null;
}

export interface CreateToolRepairRequest {
  toolId: number;
  repairDate: string;
  cost: number;
  condition: string;
  description?: string | null;
}

export interface UpdateToolRepairRequest extends CreateToolRepairRequest {
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
