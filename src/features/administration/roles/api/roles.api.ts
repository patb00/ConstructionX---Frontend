import type {
  NewRoleRequest,
  Role,
  RoleBase,
  UpdatePermissionsRequest,
  UpdateRoleRequest,
} from "..";
import { httpGet, httpPost, httpPut, httpDelete } from "../../../../lib/http";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Roles";

export const RolesApi = {
  add: async (payload: NewRoleRequest) => {
    const res = await httpPost<ApiEnvelope<Role>>(`${base}/add`, payload);
    return res;
  },

  update: async (payload: UpdateRoleRequest) => {
    const res = await httpPut<ApiEnvelope<Role>>(`${base}/update`, payload);
    return res;
  },

  updatePermissions: async (payload: UpdatePermissionsRequest) => {
    const res = await httpPut<ApiEnvelope<Role>>(
      `${base}/update-permissions`,
      payload
    );
    return res;
  },

  delete: async (roleId: string) => {
    const res = await httpDelete<ApiEnvelope<string>>(
      `${base}/delete/${encodeURIComponent(roleId)}`
    );
    return res;
  },

  getAll: async (): Promise<Role[]> => {
    const res = await httpGet<ApiEnvelope<Role[]>>(`${base}/all`);
    return res.data;
  },

  getPartial: async (roleId: string): Promise<RoleBase> => {
    const res = await httpGet<ApiEnvelope<RoleBase>>(
      `${base}/partial/${encodeURIComponent(roleId)}`
    );
    return res.data;
  },

  getFull: async (roleId: string): Promise<Role> => {
    const res = await httpGet<ApiEnvelope<Role>>(
      `${base}/full/${encodeURIComponent(roleId)}`
    );
    return res.data;
  },
};
