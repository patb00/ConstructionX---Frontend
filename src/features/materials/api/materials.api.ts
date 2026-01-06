import type {
  Material,
  NewMaterialRequest,
  UpdateMaterialRequest,
  PagedResult,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/Materials";

export const MaterialsApi = {
  add: async (payload: NewMaterialRequest) => {
    return authFetch<ApiEnvelope<Material>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateMaterialRequest) => {
    return authFetch<ApiEnvelope<Material>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (materialId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${materialId}`, {
      method: "DELETE",
    });
  },

  getById: async (materialId: number): Promise<Material> => {
    const res = await authFetch<ApiEnvelope<Material>>(`${base}/${materialId}`);
    return res.data;
  },

  getAll: async (page: number, pageSize: number) => {
    const res = await authFetch<ApiEnvelope<PagedResult<Material>>>(
      `${base}/get-all?Page=${page}&PageSize=${pageSize}`
    );
    return res.data;
  },
};
