import { useQuery } from "@tanstack/react-query";
import type { ConstructionSite } from "..";
import { constructionSitesKeys } from "../api/construction-site.keys";
import { ConstructionSiteApi } from "../api/construction-site.api";

export function useConstructionSite(constructionSiteId: number) {
  return useQuery<ConstructionSite>({
    queryKey: constructionSitesKeys.detail(constructionSiteId),
    queryFn: () => ConstructionSiteApi.getById(constructionSiteId),
  });
}
