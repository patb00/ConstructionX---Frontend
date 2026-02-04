import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ConstructionSiteApi } from "../../construction_site/api/construction-site.api";
import { constructionSitesKeys } from "../../construction_site/api/construction-site.keys";

export type Option = { label: string; value: number };

export function useConstructionSiteOptions() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: constructionSitesKeys.list(),
    queryFn: () =>
      ConstructionSiteApi.getAll({
        page: 1,
        pageSize: 1000, 
        sortBy: "name",
        sortDirection: "asc", 
      }),
  });

  const options: Option[] = useMemo(() => {
    return (data?.items ?? []).map((cs) => ({
      label: cs.name,
      value: cs.id,
    }));
  }, [data]);

  return { options, isLoading, isError, error };
}
