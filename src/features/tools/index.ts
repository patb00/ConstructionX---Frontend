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

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
