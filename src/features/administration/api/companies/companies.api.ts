import { httpGet, httpPost, httpPut, httpDelete } from "../../../../lib/http";
import type { ApiEnvelope } from "../../types";

export type CompanyId = number;

export type Company = {
  id: CompanyId;
  name: string;
  dateOfCreation: string;
};

export type NewCompanyRequest = {
  name: string;
  dateOfCreation: string;
};

export type UpdateCompanyRequest = {
  id: CompanyId;
  name: string;
  dateOfCreation: string;
};

const base = "/api/Companies";

export const CompaniesApi = {
  add: async (payload: NewCompanyRequest): Promise<string> => {
    const res = await httpPost<string>(`${base}/add`, payload);
    return res;
  },

  update: async (payload: UpdateCompanyRequest): Promise<string> => {
    const res = await httpPut<string>(`${base}/update`, payload);
    return res;
  },

  delete: async (companyId: CompanyId): Promise<string> => {
    const res = await httpDelete<string>(`${base}/${companyId}`);
    return res;
  },

  getById: async (companyId: CompanyId): Promise<Company> => {
    const res = await httpGet<Company>(`${base}/${companyId}`);
    return res;
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
