import { authFetch } from "../../../../lib/authFetch";
import type { Company, NewCompanyRequest, UpdateCompanyRequest } from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Companies";

export const CompaniesApi = {
  add: async (payload: NewCompanyRequest) => {
    const res = await authFetch<ApiEnvelope<Company>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },

  update: async (payload: UpdateCompanyRequest) => {
    const res = await authFetch<ApiEnvelope<Company>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },

  delete: async (companyId: number) => {
    const res = await authFetch<ApiEnvelope<Company>>(`${base}/${companyId}`, {
      method: "DELETE",
    });
    return res;
  },

  getById: async (companyId: number) => {
    const res = await authFetch<ApiEnvelope<Company>>(`${base}/${companyId}`);
    return res.data;
  },

  getByName: async (name: string): Promise<Company> => {
    const res = await authFetch<Company>(
      `${base}/get-by-name/${encodeURIComponent(name)}`
    );
    return res;
  },

  getAll: async (): Promise<Company[]> => {
    const res = await authFetch<ApiEnvelope<Company[]>>(`${base}/get-all`);
    return res.data;
  },
};
