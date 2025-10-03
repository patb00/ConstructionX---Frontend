export type RoleBase = {
  id: string;
  name: string;
  description: string;
};

export type Role = RoleBase & {
  permissions: string[];
};

export type NewRoleRequest = {
  name: string;
  description: string;
};

export type UpdateRoleRequest = {
  id: string;
  name: string;
  description: string;
};

export type UpdatePermissionsRequest = {
  roleId: string;
  newPermissions: string[];
};

export type AllPermissionsResponse = {
  permissions: string[];
};
