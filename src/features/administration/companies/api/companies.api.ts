import { httpGet, httpPost, httpPut, httpDelete } from "../../../../lib/http";
import type { Company, NewCompanyRequest, UpdateCompanyRequest } from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Companies";

export const CompaniesApi = {
  add: async (payload: NewCompanyRequest) => {
    const res = await httpPost<ApiEnvelope<Company>>(`${base}/add`, payload);
    return res;
  },

  update: async (payload: UpdateCompanyRequest) => {
    const res = await httpPut<ApiEnvelope<Company>>(`${base}/update`, payload);
    return res;
  },

  delete: async (companyId: number) => {
    const res = await httpDelete<ApiEnvelope<Company>>(`${base}/${companyId}`);
    return res;
  },

  getById: async (companyId: number) => {
    const res = await httpGet<ApiEnvelope<Company>>(`${base}/${companyId}`);
    return res.data;
  },

  getByName: async (name: string): Promise<Company> => {
    const res = await httpGet<Company>(
      `${base}/get-by-name/${encodeURIComponent(name)}`
    );
    return res;
  },

  getAll: async (): Promise<Company[]> => {
    const res = await httpGet<ApiEnvelope<Company[]>>(`${base}/get-all`);
    return res.data;
  },
};
