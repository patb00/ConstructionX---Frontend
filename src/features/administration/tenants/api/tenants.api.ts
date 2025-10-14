import { authFetch } from "../../../../lib/authFetch";
import type { ApiEnvelope, NewTenantRequest, Tenant } from "..";

export type TenantId = string;

export type UpdateSubscriptionRequest = {
  tenantId: TenantId;
  newExpirationDate: string;
};

const base = "/api/Tenants";

export const TenantsApi = {
  add: async (payload: NewTenantRequest) => {
    return authFetch<ApiEnvelope<Tenant>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  activate: async (id: TenantId) => {
    return authFetch<ApiEnvelope<Tenant>>(`${base}/${id}/activate`, {
      method: "PUT",
    });
  },

  deactivate: async (id: TenantId) => {
    return authFetch<ApiEnvelope<Tenant>>(`${base}/${id}/deactivate`, {
      method: "PUT",
    });
  },

  updateSubscription: async (p: UpdateSubscriptionRequest) => {
    return authFetch<ApiEnvelope<Tenant>>(`${base}/update-subscription`, {
      method: "PUT",
      body: JSON.stringify(p),
    });
  },

  getById: async (id: TenantId) => {
    const res = await authFetch<ApiEnvelope<Tenant>>(`${base}/${id}`);
    return res.data;
  },

  getAll: async () => {
    const res = await authFetch<ApiEnvelope<Tenant[]>>(`${base}/get-all`);
    return res.data;
  },
};
