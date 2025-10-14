import { authFetch } from "../../../../lib/authFetch";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  UpdateUserRolesRequest,
  UpdateUserStatusRequest,
  User,
  UserPermissionsResponse,
  UserRolesResponse,
  UserSummary,
} from "..";
import type { ApiEnvelope } from "../../tenants";

const base = "/api/Users";

export const UsersApi = {
  register: async (payload: RegisterUserRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateUserRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  updateStatus: async (payload: UpdateUserStatusRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/update-status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  updateRoles: async (userId: string, payload: UpdateUserRolesRequest) => {
    return authFetch<ApiEnvelope<string>>(
      `${base}/update-roles/${encodeURIComponent(userId)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  delete: async (userId: string) => {
    return authFetch<ApiEnvelope<string>>(
      `${base}/delete/${encodeURIComponent(userId)}`,
      { method: "DELETE" }
    );
  },

  getAll: async (): Promise<UserSummary[]> => {
    const res = await authFetch<ApiEnvelope<UserSummary[]>>(`${base}/all`);
    return res.data;
  },

  getById: async (userId: string): Promise<User> => {
    const res = await authFetch<ApiEnvelope<User>>(
      `${base}/${encodeURIComponent(userId)}`
    );
    return res.data;
  },

  getPermissions: async (userId: string): Promise<UserPermissionsResponse> => {
    const res = await authFetch<ApiEnvelope<UserPermissionsResponse>>(
      `${base}/permissions/${encodeURIComponent(userId)}`
    );
    return res.data;
  },

  getUserRoles: async (userId: string): Promise<UserRolesResponse> => {
    const res = await authFetch<ApiEnvelope<UserRolesResponse>>(
      `${base}/user-roles/${encodeURIComponent(userId)}`
    );
    return res.data;
  },

  // ✅ Change password (existing)
  changePassword: async (payload: ChangePasswordRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/change-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ✅ Forgot password (new)
  forgotPassword: async (tenant: string, payload: ForgotPasswordRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/forgot-password`, {
      method: "POST",
      headers: {
        tenant,
      },
      body: JSON.stringify(payload),
    });
  },

  // ✅ Reset password (new)
  resetPassword: async (tenant: string, payload: ResetPasswordRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/reset-password`, {
      method: "POST",
      headers: {
        tenant,
      },
      body: JSON.stringify(payload),
    });
  },
};
