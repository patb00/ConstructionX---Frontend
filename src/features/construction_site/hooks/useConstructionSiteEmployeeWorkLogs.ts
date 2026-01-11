import { useQuery } from "@tanstack/react-query";
import type { ConstructionSiteEmployeeWorkLogDay } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useConstructionSiteEmployeeWorkLogs(
  constructionSiteId: number | undefined,
  employeeId: number | undefined
) {
  return useQuery<ConstructionSiteEmployeeWorkLogDay[]>({
    enabled: !!constructionSiteId && !!employeeId,
    queryKey: constructionSitesKeys.employeeWorkLogsDetail(
      constructionSiteId ?? 0,
      employeeId ?? 0
    ),
    queryFn: () =>
      ConstructionSiteApi.getEmployeeWorkLogs({
        constructionSiteId: constructionSiteId!,
        employeeId: employeeId!,
      }),
  });
}
