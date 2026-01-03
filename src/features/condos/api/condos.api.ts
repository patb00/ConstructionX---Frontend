import type {
  Condo,
  NewCondoRequest,
  UpdateCondoRequest,
  GetCondosQuery,
  PagedResult,
  AssignEmployeesToCondoRequest,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/Condos";

export const CondosApi = {
  add: async (payload: NewCondoRequest) => {
    return authFetch<ApiEnvelope<Condo>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateCondoRequest) => {
    return authFetch<ApiEnvelope<Condo>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (condoId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${condoId}`, {
      method: "DELETE",
    });
  },

  getById: async (condoId: number): Promise<Condo> => {
    const res = await authFetch<ApiEnvelope<Condo>>(`${base}/${condoId}`);
    return res.data;
  },

  assignEmployees: async (payload: AssignEmployeesToCondoRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-employees`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  getAll: async (query?: GetCondosQuery): Promise<PagedResult<Condo>> => {
    const params = new URLSearchParams();

    params.append("Page", String(query?.page ?? 1));
    params.append("PageSize", String(query?.pageSize ?? 20));

    const qs = params.toString();
    const url = qs ? `${base}/get-all?${qs}` : `${base}/get-all`;

    const res = await authFetch<ApiEnvelope<PagedResult<Condo>>>(url);
    return res.data;
  },
};
