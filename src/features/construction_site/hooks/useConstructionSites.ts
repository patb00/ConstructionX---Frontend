import { useQuery } from "@tanstack/react-query";
import type { ConstructionSite } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { constructionSitesKeys } from "../api/construction-site.keys";
import { ConstructionSiteApi } from "../api/construction-site.api";

interface TransformedConstructionSitesData {
  columnDefs: GridColDef<ConstructionSite>[];
  rowDefs: ConstructionSite[];
}

export const useConstructionSites = () => {
  const { data, error, isLoading } = useQuery<
    ConstructionSite[],
    Error,
    TransformedConstructionSitesData
  >({
    queryKey: constructionSitesKeys.list(),
    queryFn: ConstructionSiteApi.getAll,
    select: (rows): TransformedConstructionSitesData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => ({
        field: key,
        headerName: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        width: 180,
      }));

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    constructionSitesRows: data?.rowDefs ?? [],
    constructionSitesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
