import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GridColDef, GridFilterModel } from "@mui/x-data-grid";
import type { GridPaginationModel } from "@mui/x-data-grid-pro";

import type { ConstructionSite, GetConstructionSitesQuery } from "..";
import { constructionSitesKeys } from "../api/construction-site.keys";
import { ConstructionSiteApi } from "../api/construction-site.api";

type Option = { value: any; label: string };

type TransformedConstructionSitesData = {
  columnDefs: GridColDef<ConstructionSite>[];
  rowDefs: ConstructionSite[];
  total: number;
};

const FILTER_FIELDS = [
  "status",
  "location",
  "siteManagerId",
  "employeeId",
  "toolId",
  "vehicleId",
  "startDate",
  "plannedEndDate",
] as const;

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
    if (!item?.field) continue;
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

function headerize(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function sanitizeFilterModel(model: GridFilterModel): GridFilterModel {
  const allowed = new Set<string>(FILTER_FIELDS);
  return {
    ...model,
    items: (model.items ?? []).filter(
      (it) => it?.field && allowed.has(it.field)
    ),
  };
}

export const useConstructionSites = (args: {
  statusOptions: Option[];
  employeeOptions: Option[];
  toolOptions: Option[];
  vehicleOptions: Option[];
}) => {
  const { statusOptions, employeeOptions, toolOptions, vehicleOptions } = args;

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [filterModel, _setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const setFilterModel = useCallback(
    (next: GridFilterModel | ((prev: GridFilterModel) => GridFilterModel)) => {
      _setFilterModel((prev) =>
        sanitizeFilterModel(typeof next === "function" ? next(prev) : next)
      );
    },
    []
  );

  const queryParams = useMemo(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ...mapFiltersToQuery(filterModel),
    }),
    [paginationModel, filterModel]
  );

  const { data, error, isLoading, isError } = useQuery<
    any,
    Error,
    TransformedConstructionSitesData
  >({
    queryKey: [...constructionSitesKeys.list(), paginationModel, filterModel],
    queryFn: () => ConstructionSiteApi.getAll(queryParams),
    select: (paged): TransformedConstructionSitesData => {
      const rows: ConstructionSite[] = paged?.items ?? [];
      const total: number = paged?.total ?? 0;

      const overrides: Record<string, Partial<GridColDef<ConstructionSite>>> = {
        startDate: {
          type: "date",
          width: 160,
          valueGetter: (value) => (value ? new Date(value as string) : null),
        },
        plannedEndDate: {
          type: "date",
          width: 180,
          valueGetter: (value) => (value ? new Date(value as string) : null),
        },
        status: {
          type: "singleSelect",
          valueOptions: statusOptions,
          width: 140,
        },
        siteManagerId: {
          type: "singleSelect",
          valueOptions: employeeOptions,
          width: 200,
        },
        employeeId: {
          type: "singleSelect",
          valueOptions: employeeOptions,
          width: 200,
        },
        toolId: {
          type: "singleSelect",
          valueOptions: toolOptions,
          width: 200,
        },
        vehicleId: {
          type: "singleSelect",
          valueOptions: vehicleOptions,
          width: 200,
        },
        constructionSiteEmployees: {
          headerName: "Employees",
          width: 140,
          filterable: false,
          sortable: false,
          valueGetter: (_value, row: any) =>
            row?.constructionSiteEmployees?.length ?? 0,
        },
        constructionSiteTools: {
          headerName: "Tools",
          width: 120,
          filterable: false,
          sortable: false,
          valueGetter: (_value, row: any) =>
            row?.constructionSiteTools?.length ?? 0,
        },
        constructionSiteVehicles: {
          headerName: "Vehicles",
          width: 120,
          filterable: false,
          sortable: false,
          valueGetter: (_value, row: any) =>
            row?.constructionSiteVehicles?.length ?? 0,
        },
      };

      const allowed = new Set<string>(FILTER_FIELDS);

      const autoKeys = rows.length
        ? Array.from(
            new Set(rows.flatMap((r) => Object.keys(r as any)))
          ).filter((k) => k !== "id")
        : [];

      const baseFromKeys: GridColDef<ConstructionSite>[] = autoKeys.map(
        (field) => ({
          field,
          headerName: headerize(field),
          width: 180,
          filterable: allowed.has(field),
          ...(overrides[field] ?? {}),
        })
      );

      const ensureFilterColumns: GridColDef<ConstructionSite>[] =
        FILTER_FIELDS.filter(
          (f) => !baseFromKeys.some((c) => c.field === f)
        ).map((field) => ({
          field,
          headerName: headerize(field),
          width: 180,
          filterable: true,
          ...(overrides[field] ?? {}),
        })) as GridColDef<ConstructionSite>[];

      const columnDefs = [...baseFromKeys, ...ensureFilterColumns];

      const rowDefs = rows.map((r) => ({ ...r, id: (r as any).id }));

      return { columnDefs, rowDefs, total };
    },
    placeholderData: (prev: TransformedConstructionSitesData | undefined) =>
      prev,
  });

  return {
    constructionSitesRows: data?.rowDefs ?? [],
    constructionSitesColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    error,
    isLoading,
    isError,
  };
};
