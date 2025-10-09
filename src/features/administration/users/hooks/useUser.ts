import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "../api/users.keys";
import { UsersApi } from "../api/users.api";

export function useUser(userId?: string) {
  return useQuery({
    queryKey: userId ? usersKeys.detail(userId) : usersKeys.detail("nil"),
    queryFn: () => {
      if (!userId) throw new Error("Missing tenant id");
      return UsersApi.getById(userId);
    },
    enabled: !!userId,
  });
}
