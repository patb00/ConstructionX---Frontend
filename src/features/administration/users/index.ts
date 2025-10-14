export type UserSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  isActive: boolean;
};

export type User = UserSummary & {};

export type RegisterUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  isActive: boolean;
};

export type UpdateUserRequest = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type UpdateUserStatusRequest = {
  userId: string;
  activation: boolean;
};

export type ChangePasswordRequest = {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

// ✅ New request types
export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordVariables = {
  tenant: string;
  payload: ForgotPasswordRequest;
};

export type ResetPasswordVariables = {
  tenant: string;
  payload: ResetPasswordRequest;
};

export type ResetPasswordRequest = {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type UserRoleAssignment = {
  roleId: string;
  name: string;
  description: string;
  isAssigned: boolean;
};

export type UpdateUserRolesRequest = {
  userRoles: UserRoleAssignment[];
};

export type UserPermissionsResponse = {
  permissions: string[];
};

export type UserRolesResponse = {
  userRoles: UserRoleAssignment[];
};
