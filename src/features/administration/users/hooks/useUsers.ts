import { useQuery } from "@tanstack/react-query";

import { usersKeys } from "../api/users.keys";
import { UsersApi } from "../api/users.api";

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: () => UsersApi.getAll(),
  });
}
