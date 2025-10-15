import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewRoleRequest } from "..";
import { RolesApi } from "../api/roles.api";
import { rolesKeys } from "../api/roles.keys";

export function useAddRole() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewRoleRequest) => RolesApi.add(payload),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: rolesKeys.list() });
      enqueueSnackbar(data.messages[0] || data?.messages, {
        variant: "success",
      });

      navigate("/app/administration/roles");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
