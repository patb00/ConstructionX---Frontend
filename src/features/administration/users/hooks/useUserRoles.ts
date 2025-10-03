import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "../api/users.keys";
import { UsersApi } from "../api/users.api";
import type { UserRoleAssignment, UserRolesResponse } from "..";

export function useUserRoles(userId: string) {
  return useQuery<UserRoleAssignment[] | UserRolesResponse>({
    queryKey: usersKeys.roles(userId),
    queryFn: () => UsersApi.getUserRoles(userId),
  });
}
