import { useQuery } from "@tanstack/react-query";

import type { GridColDef } from "@mui/x-data-grid";
import type { Vehicle } from "..";
import { vehiclesKeys } from "../api/vehicles.keys";
import { VehiclesApi } from "../api/vehicles.api";

interface TransformedVehiclesData {
  columnDefs: GridColDef<Vehicle>[];
  rowDefs: Vehicle[];
}

export const useVehicles = () => {
  const { data, error, isLoading, isError } = useQuery<
    Vehicle[],
    Error,
    TransformedVehiclesData
  >({
    queryKey: vehiclesKeys.list(),
    queryFn: VehiclesApi.getAll,
    select: (rows): TransformedVehiclesData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return {
          field: key,
          headerName,
          width: 180,
        };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));
      return { columnDefs, rowDefs };
    },
  });

  return {
    vehiclesRows: data?.rowDefs ?? [],
    vehiclesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
    isError,
  };
};
