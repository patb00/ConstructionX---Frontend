import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "../api/users.keys";
import { UsersApi } from "../api/users.api";
import { useAuthStore } from "../../../auth/store/useAuthStore";
import type { UserPermissionsResponse } from "..";

export function useMyPermissions() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<UserPermissionsResponse>({
    queryKey: usersKeys.mePermissions(),
    queryFn: () => UsersApi.getMyPermissions(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
