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

export type { PagedResult } from "../../shared/types/api";
