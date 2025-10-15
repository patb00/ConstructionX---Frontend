import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { NewConstructionSiteRequest } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useAddConstructionSite() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: NewConstructionSiteRequest) =>
      ConstructionSiteApi.add(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: constructionSitesKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/constructionSites");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
