import type { Tool, NewToolRequest, UpdateToolRequest } from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/Tools";

export const ToolsApi = {
  add: async (payload: NewToolRequest) => {
    return authFetch<ApiEnvelope<Tool>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateToolRequest) => {
    return authFetch<ApiEnvelope<Tool>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (toolId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${toolId}`, {
      method: "DELETE",
    });
  },

  getById: async (toolId: number): Promise<Tool> => {
    const res = await authFetch<ApiEnvelope<Tool>>(`${base}/${toolId}`);
    return res.data;
  },

  getAll: async (): Promise<Tool[]> => {
    const res = await authFetch<ApiEnvelope<Tool[]>>(`${base}/get-all`);
    return res.data;
  },
};
