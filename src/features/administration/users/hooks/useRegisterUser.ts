import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { UsersApi } from "../api/users.api";
import { usersKeys } from "../api/users.keys";
import type { RegisterUserRequest } from "..";

export function useRegisterUser() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: RegisterUserRequest) => UsersApi.register(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: usersKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });

      navigate("/app/administration/users");
    },

    onError: (error: any) => {
      enqueueSnackbar(error.messages[0] || error?.messages, {
        variant: "error",
      });
    },
  });
}
