import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GridColDef } from "@mui/x-data-grid";
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

function headerize(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

type UseWorkLogsAllArgs = Partial<
  Pick<
    GetConstructionSiteEmployeeWorkLogsAllQuery,
    "dateFrom" | "dateTo" | "employeeId" | "constructionSiteId"
  >
>;

export const useConstructionSiteEmployeeWorkLogsAll = (
  args?: UseWorkLogsAllArgs,
) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const queryParams = useMemo<GetConstructionSiteEmployeeWorkLogsAllQuery>(
    () => ({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      ...(args ?? {}),
    }),
    [paginationModel, args],
  );

  const { data, error, isLoading, isError } = useQuery<
    any,
    Error,
    TransformedWorkLogsData
  >({
    queryKey: constructionSitesKeys.employeeWorkLogsAll(queryParams),
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

      const autoKeys = rows.length
        ? Array.from(
            new Set(rows.flatMap((r) => Object.keys(r as any))),
          ).filter((k) => k !== "id")
        : [];

      const columnDefs: GridColDef<ConstructionSiteEmployeeWorkLog>[] =
        autoKeys.map((field) => ({
          field,
          headerName: headerize(field),
          width: 180,
          ...(overrides[field] ?? {}),
        }));

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
    error,
    isLoading,
    isError,
  };
};
