import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { AssignVehiclesRequest } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useAssignVehiclesToConstructionSite() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: AssignVehiclesRequest) =>
      ConstructionSiteApi.assignVehicles(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: constructionSitesKeys.list() });
      qc.invalidateQueries({ queryKey: constructionSitesKeys.all });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
