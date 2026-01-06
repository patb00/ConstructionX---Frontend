export interface Material {
  id: number;
  name: string;
  unitOfMeasure: string | null;
  quantity: number;
  unitPrice: number;
  description: string | null;
  articleCode: string | null;
  barcode: string | null;
  weight: number | null;
}

export interface NewMaterialRequest {
  name: string;
  unitOfMeasure: string;
  quantity: number;
  unitPrice: number;
  description?: string | null;
  articleCode?: string | null;
  barcode?: string | null;
  weight?: number | null;
}

export interface UpdateMaterialRequest extends NewMaterialRequest {
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
