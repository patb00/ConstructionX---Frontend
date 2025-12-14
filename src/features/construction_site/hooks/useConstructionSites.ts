import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GridFilterModel } from "@mui/x-data-grid";
import type { GridPaginationModel } from "@mui/x-data-grid-pro";
import type { GetConstructionSitesQuery } from "..";
import { constructionSitesKeys } from "../api/construction-site.keys";
import { ConstructionSiteApi } from "../api/construction-site.api";

function toApiDate(value: unknown): string | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(String(value));

  if (isNaN(date.getTime())) return undefined;

  return date.toISOString().split("T")[0];
}

function mapFiltersToQuery(
  filterModel: GridFilterModel
): Partial<GetConstructionSitesQuery> {
  const query: Partial<GetConstructionSitesQuery> = {};

  for (const item of filterModel.items) {
    if (item.value == null || item.value === "") continue;

    switch (item.field) {
      case "status":
        query.status = Number(item.value);
        break;

      case "location":
        query.location = String(item.value);
        break;

      case "siteManagerId":
        query.siteManagerId = Number(item.value);
        break;

      case "employeeId":
        query.employeeId = Number(item.value);
        break;

      case "toolId":
        query.toolId = Number(item.value);
        break;

      case "vehicleId":
        query.vehicleId = Number(item.value);
        break;

      case "startDate":
        query.startDate = toApiDate(item.value);
        break;

      case "plannedEndDate":
        query.plannedEndDate = toApiDate(item.value);
        break;
    }
  }

  return query;
}

export const useConstructionSites = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const queryParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ...mapFiltersToQuery(filterModel),
    }),
    [paginationModel, filterModel]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: [...constructionSitesKeys.list(), paginationModel, filterModel],
    queryFn: () => ConstructionSiteApi.getAll(queryParams),
    placeholderData: (prev) => prev,
  });

  return {
    rows: data?.items ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    isLoading,
    error,
  };
};
