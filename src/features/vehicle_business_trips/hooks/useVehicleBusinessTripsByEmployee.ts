import { useQuery } from "@tanstack/react-query";
import type { GridColDef } from "@mui/x-data-grid";
import type { VehicleBusinessTrip } from "..";
import { vehicleBusinessTripsKeys } from "../api/vehicle-business-trips.keys";
import { VehicleBusinessTripsApi } from "../api/vehicle-business-trips.api";

interface TransformedData {
  columnDefs: GridColDef<VehicleBusinessTrip>[];
  rowDefs: VehicleBusinessTrip[];
  total: number;
}

export function useVehicleBusinessTripsByEmployee(employeeId: number) {
  const { data, error, isLoading, isError } = useQuery<
    VehicleBusinessTrip[],
    Error,
    TransformedData
  >({
    queryKey: vehicleBusinessTripsKeys.byEmployee(employeeId),
    queryFn: () => VehicleBusinessTripsApi.getByEmployee(employeeId),
    enabled: Number.isFinite(employeeId) && employeeId > 0,
    select: (rows): TransformedData => {
      const safeRows = rows ?? [];
      if (!safeRows.length) {
        return { columnDefs: [], rowDefs: [], total: 0 };
      }

      const allKeys = Array.from(new Set(safeRows.flatMap(Object.keys)));

      const columnDefs: GridColDef<VehicleBusinessTrip>[] = allKeys.map(
        (key) => {
          const headerName = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return {
            field: key,
            headerName,
            width: 180,
          } as GridColDef<VehicleBusinessTrip>;
        }
      );

      const rowDefs = safeRows.map((r, idx) => ({
        ...r,
        id: (r as any).id ?? `${employeeId}-${idx}`,
      }));

      return { columnDefs, rowDefs, total: safeRows.length };
    },
  });

  return {
    vehicleBusinessTripsRows: data?.rowDefs ?? [],
    vehicleBusinessTripsColumns: data?.columnDefs ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
    isError,
  };
}
