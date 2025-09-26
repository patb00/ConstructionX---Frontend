import { httpGet, httpPost, httpPut } from "../../../../lib/http";
import type { ApiEnvelope } from "../../types";

export type TenantId = string;

export type Tenant = {
  identifier: TenantId;
  name: string;
  connectionString: string | null;
  email: string;
  firstName: string;
  lastName: string;
  validUpToDate: string;
  isActive: boolean;
};

export type NewTenantRequest = {
  identifier: string;
  name: string;
  connectionString: string | null | string;
  email: string;
  firstName: string;
  lastName: string;
  validUpToDate: string;
  isActive: boolean;
};

export type UpdateSubscriptionRequest = {
  tenantId: TenantId;
  newExpirationDate: string;
};

const base = "/api/Tenants";

export const TenantsApi = {
  add: async (payload: NewTenantRequest) => {
    const res = await httpPost<ApiEnvelope<Tenant>>(`${base}/add`, payload);
    return res;
  },
  activate: async (id: TenantId) => {
    const res = await httpPut<ApiEnvelope<Tenant>>(`${base}/${id}/activate`);
    return res;
  },
  deactivate: async (id: TenantId) => {
    const res = await httpPut<ApiEnvelope<Tenant>>(`${base}/${id}/deactivate`);
    return res;
  },
  updateSubscription: async (p: UpdateSubscriptionRequest) => {
    const res = await httpPut<ApiEnvelope<Tenant>>(
      `${base}/update-subscription`,
      p
    );
    return res;
  },
  getById: async (id: TenantId) => {
    const res = await httpGet<ApiEnvelope<Tenant>>(`${base}/${id}`);
    return res.data;
  },
  getAll: async () => {
    const res = await httpGet<ApiEnvelope<Tenant[]>>(`${base}/get-all`);
    return res.data;
  },
};
