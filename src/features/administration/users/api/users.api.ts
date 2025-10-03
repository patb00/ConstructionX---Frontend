import type {
  ChangePasswordRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UpdateUserRolesRequest,
  UpdateUserStatusRequest,
  User,
  UserPermissionsResponse,
  UserRolesResponse,
  UserSummary,
} from "..";
import { httpGet, httpPost, httpPut, httpDelete } from "../../../../lib/http";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Users";

export const UsersApi = {
  register: async (payload: RegisterUserRequest) => {
    const res = await httpPost<ApiEnvelope<string>>(
      `${base}/register`,
      payload
    );
    return res;
  },

  update: async (payload: UpdateUserRequest) => {
    const res = await httpPut<ApiEnvelope<string>>(`${base}/update`, payload);
    return res;
  },

  updateStatus: async (payload: UpdateUserStatusRequest) => {
    const res = await httpPut<ApiEnvelope<string>>(
      `${base}/update-status`,
      payload
    );
    return res;
  },

  updateRoles: async (userId: string, payload: UpdateUserRolesRequest) => {
    const res = await httpPut<ApiEnvelope<string>>(
      `${base}/update-roles/${encodeURIComponent(userId)}`,
      payload
    );
    return res;
  },

  delete: async (userId: string) => {
    const res = await httpDelete<ApiEnvelope<string>>(
      `${base}/delete/${encodeURIComponent(userId)}`
    );
    return res;
  },

  getAll: async (): Promise<UserSummary[]> => {
    const res = await httpGet<ApiEnvelope<UserSummary[]>>(`${base}/all`);
    return res.data;
  },

  getById: async (userId: string): Promise<User> => {
    const res = await httpGet<ApiEnvelope<User>>(
      `${base}/${encodeURIComponent(userId)}`
    );
    return res.data;
  },

  getPermissions: async (userId: string): Promise<UserPermissionsResponse> => {
    const res = await httpGet<ApiEnvelope<UserPermissionsResponse>>(
      `${base}/permissions/${encodeURIComponent(userId)}`
    );
    return res.data;
  },

  getUserRoles: async (userId: string): Promise<UserRolesResponse> => {
    const res = await httpGet<ApiEnvelope<UserRolesResponse>>(
      `${base}/user-roles/${encodeURIComponent(userId)}`
    );
    return res.data;
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    const res = await httpPost<ApiEnvelope<string>>(
      `${base}/change-password`,
      payload
    );
    return res;
  },
};
