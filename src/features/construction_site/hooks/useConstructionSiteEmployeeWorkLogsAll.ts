import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GridColDef, GridFilterModel } from "@mui/x-data-grid";
import type { GridPaginationModel } from "@mui/x-data-grid-pro";

import type {
  ConstructionSiteEmployeeWorkLog,
  GetConstructionSiteEmployeeWorkLogsAllQuery,
} from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

type TransformedWorkLogsData = {
  columnDefs: GridColDef<ConstructionSiteEmployeeWorkLog>[];
  rowDefs: ConstructionSiteEmployeeWorkLog[];
  total: number;
};

const FILTER_FIELDS = ["constructionSiteId", "employeeId", "workDate"] as const;

function toApiDate(value: unknown): string | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(String(value));
  if (isNaN(date.getTime())) return undefined;

  return date.toISOString().split("T")[0];
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

function mapFiltersToQuery(
  filterModel: GridFilterModel
): Partial<GetConstructionSiteEmployeeWorkLogsAllQuery> {
  const query: Partial<GetConstructionSiteEmployeeWorkLogsAllQuery> = {};

  for (const item of filterModel.items) {
    if (!item?.field) continue;
    if (item.value == null || item.value === "") continue;

    switch (item.field) {
      case "constructionSiteId":
        query.constructionSiteId = Number(item.value);
        break;
      case "employeeId":
        query.employeeId = Number(item.value);
        break;
      case "workDate": {
        const d = toApiDate(item.value);
        if (d) {
          query.dateFrom = d;
          query.dateTo = d;
        }
        break;
      }
    }
  }

  return query;
}

export const useConstructionSiteEmployeeWorkLogsAll = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
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
    TransformedWorkLogsData
  >({
    queryKey: [
      ...constructionSitesKeys.employeeWorkLogsAll(queryParams),
      paginationModel,
      filterModel,
    ],
    queryFn: () => ConstructionSiteApi.getAllEmployeeWorkLogs(queryParams),

    select: (paged): TransformedWorkLogsData => {
      const rows: ConstructionSiteEmployeeWorkLog[] = paged?.items ?? [];
      const total: number = paged?.total ?? 0;

      const overrides: Record<
        string,
        Partial<GridColDef<ConstructionSiteEmployeeWorkLog>>
      > = {
        workDate: {
          type: "date",
          width: 160,
          valueGetter: (value) => (value ? new Date(value as string) : null),
        },
      };

      const allowed = new Set<string>(FILTER_FIELDS);

      const autoKeys = rows.length
        ? Array.from(
            new Set(rows.flatMap((r) => Object.keys(r as any)))
          ).filter((k) => k !== "id")
        : [];

      const baseFromKeys: GridColDef<ConstructionSiteEmployeeWorkLog>[] =
        autoKeys.map((field) => ({
          field,
          headerName: headerize(field),
          width: 180,
          filterable: allowed.has(field),
          ...(overrides[field] ?? {}),
        }));

      const ensureFilterColumns: GridColDef<ConstructionSiteEmployeeWorkLog>[] =
        FILTER_FIELDS.filter(
          (f) => !baseFromKeys.some((c) => c.field === f)
        ).map((field) => ({
          field,
          headerName: headerize(field),
          width: 180,
          filterable: true,
          ...(overrides[field] ?? {}),
        })) as GridColDef<ConstructionSiteEmployeeWorkLog>[];

      const columnDefs = [...baseFromKeys, ...ensureFilterColumns];

      const rowDefs = rows.map((r) => ({
        ...r,
        id:
          (r as any).id ??
          `${r.constructionSiteId}-${r.employeeId}-${r.workDate}-${r.startTime}-${r.endTime}`,
      })) as any;

      return { columnDefs, rowDefs, total };
    },

    placeholderData: (prev: TransformedWorkLogsData | undefined) => prev,
  });

  return {
    rows: data?.rowDefs ?? [],
    columns: data?.columnDefs ?? [],
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
