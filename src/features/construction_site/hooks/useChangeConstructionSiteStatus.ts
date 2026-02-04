import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";
import type { ChangeConstructionSiteStatusRequest } from "..";
import { enqueueSnackbar } from "notistack";

export const useChangeConstructionSiteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeConstructionSiteStatusRequest) =>
      ConstructionSiteApi.changeStatus(payload),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: constructionSitesKeys.list(),
      });

      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },
    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
};
