import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { UpsertConstructionSiteEmployeeWorkLogsRequest } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useUpsertConstructionSiteEmployeeWorkLogs() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpsertConstructionSiteEmployeeWorkLogsRequest) =>
      ConstructionSiteApi.upsertEmployeeWorkLogs(payload),

    onSuccess: (data: any, payload) => {
      qc.invalidateQueries({
        queryKey: constructionSitesKeys.employeeWorkLogsDetail(
          payload.constructionSiteId,
          payload.employeeId
        ),
      });

      qc.invalidateQueries({
        queryKey: constructionSitesKeys.employeeWorkLogs(),
      });

      enqueueSnackbar(data.messages?.[0] || data?.messages, {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
