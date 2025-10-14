import { authFetch } from "../../../../lib/authFetch";
import type {
  AllPermissionsResponse,
  NewRoleRequest,
  Role,
  RoleBase,
  UpdatePermissionsRequest,
  UpdateRoleRequest,
} from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Roles";

export const RolesApi = {
  add: async (payload: NewRoleRequest) => {
    return authFetch<ApiEnvelope<Role>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateRoleRequest) => {
    return authFetch<ApiEnvelope<Role>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  updatePermissions: async (payload: UpdatePermissionsRequest) => {
    return authFetch<ApiEnvelope<Role>>(`${base}/update-permissions`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (roleId: string) => {
    return authFetch<ApiEnvelope<string>>(
      `${base}/delete/${encodeURIComponent(roleId)}`,
      { method: "DELETE" }
    );
  },

  getAll: async (): Promise<Role[]> => {
    const res = await authFetch<ApiEnvelope<Role[]>>(`${base}/all`);
    return res.data;
  },

  getPartial: async (roleId: string): Promise<RoleBase> => {
    const res = await authFetch<ApiEnvelope<RoleBase>>(
      `${base}/partial/${encodeURIComponent(roleId)}`
    );
    return res.data;
  },

  getFull: async (roleId: string): Promise<Role> => {
    const res = await authFetch<ApiEnvelope<Role>>(
      `${base}/full/${encodeURIComponent(roleId)}`
    );
    return res.data;
  },

  getAllPermissions: async (): Promise<AllPermissionsResponse> => {
    const res = await authFetch<ApiEnvelope<AllPermissionsResponse>>(
      `${base}/all-permissions`
    );
    return res.data;
  },
};
