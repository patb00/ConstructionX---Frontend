import type {
  ToolRepair,
  CreateToolRepairRequest,
  UpdateToolRepairRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/ToolRepairs";

export const ToolRepairsApi = {
  add: async (payload: CreateToolRepairRequest) => {
    return authFetch<ApiEnvelope<ToolRepair>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateToolRepairRequest) => {
    return authFetch<ApiEnvelope<ToolRepair>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (repairId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${repairId}`, {
      method: "DELETE",
    });
  },

  getById: async (repairId: number): Promise<ToolRepair> => {
    const res = await authFetch<ApiEnvelope<ToolRepair>>(`${base}/${repairId}`);
    return res.data;
  },

  getByTool: async (
    toolId: number,
    page: number,
    pageSize: number
  ): Promise<PagedResult<ToolRepair>> => {
    const res = await authFetch<ApiEnvelope<PagedResult<ToolRepair>>>(
      `${base}/tool/${toolId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<ToolRepair>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },
};
