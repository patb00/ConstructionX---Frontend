import type {
  ToolCategory,
  NewToolCategoryRequest,
  UpdateToolCategoryRequest,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/ToolCategories";

export const ToolCategoriesApi = {
  add: async (payload: NewToolCategoryRequest) => {
    return authFetch<ApiEnvelope<ToolCategory>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateToolCategoryRequest) => {
    return authFetch<ApiEnvelope<ToolCategory>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (toolCategoryId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${toolCategoryId}`, {
      method: "DELETE",
    });
  },

  getById: async (toolCategoryId: number): Promise<ToolCategory> => {
    const res = await authFetch<ApiEnvelope<ToolCategory>>(
      `${base}/${toolCategoryId}`
    );
    return res.data;
  },

  getAll: async (): Promise<ToolCategory[]> => {
    const res = await authFetch<ApiEnvelope<ToolCategory[]>>(`${base}/get-all`);
    return res.data;
  },
};
