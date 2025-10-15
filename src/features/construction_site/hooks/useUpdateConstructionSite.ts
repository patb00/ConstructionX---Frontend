import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { UpdateConstructionSiteRequest } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useUpdateConstructionSite() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateConstructionSiteRequest) =>
      ConstructionSiteApi.update(payload),

    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: constructionSitesKeys.list() });
      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
      navigate("/app/administration/constructionSites");
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
