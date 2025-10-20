import type {
  AssignEmployeesRequest,
  AssignToolsRequest,
  AssignVehiclesRequest,
  ConstructionSite,
  NewConstructionSiteRequest,
  UpdateConstructionSiteRequest,
} from "..";
import { authFetch } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/ConstructionSite";

export const ConstructionSiteApi = {
  add: async (payload: NewConstructionSiteRequest) => {
    return authFetch<ApiEnvelope<ConstructionSite>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateConstructionSiteRequest) => {
    return authFetch<ApiEnvelope<ConstructionSite>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (constructionSiteId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${constructionSiteId}`, {
      method: "DELETE",
    });
  },

  getById: async (constructionSiteId: number): Promise<ConstructionSite> => {
    const res = await authFetch<ApiEnvelope<ConstructionSite>>(
      `${base}/${constructionSiteId}`
    );
    return res.data;
  },

  getAll: async (): Promise<ConstructionSite[]> => {
    const res = await authFetch<ApiEnvelope<ConstructionSite[]>>(
      `${base}/get-all`
    );
    return res.data;
  },

  assignEmployees: async (payload: AssignEmployeesRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-employees`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  assignTools: async (payload: AssignToolsRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-tools`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  assignVehicles: async (payload: AssignVehiclesRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-vehicles`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
