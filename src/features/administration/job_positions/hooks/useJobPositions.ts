import { useQuery } from "@tanstack/react-query";

import type { JobPosition } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { jobPositionsKeys } from "../api/job-positions.keys";
import { JobPositionsApi } from "../api/job-positions.api";

interface TransformedJobPositionsData {
  columnDefs: GridColDef<JobPosition>[];
  rowDefs: JobPosition[];
}

export const useJobPositions = () => {
  const { data, error, isLoading } = useQuery<
    JobPosition[],
    Error,
    TransformedJobPositionsData
  >({
    queryKey: jobPositionsKeys.list(),
    queryFn: JobPositionsApi.getAll,
    select: (rows): TransformedJobPositionsData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        return {
          field: key,
          headerName: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          width: 180,
        };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    jobPositionsRows: data?.rowDefs ?? [],
    jobPositionsColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
