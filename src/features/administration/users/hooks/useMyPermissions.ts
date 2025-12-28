import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "../api/users.keys";
import { UsersApi } from "../api/users.api";
import type { UserPermissionsResponse } from "..";

export function useMyPermissions() {
  return useQuery<UserPermissionsResponse>({
    queryKey: usersKeys.mePermissions(),
    queryFn: () => UsersApi.getMyPermissions(),
  });
}
