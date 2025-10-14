import { useQuery } from "@tanstack/react-query";
import { TenantsApi } from "../api/tenants.api";
import { tenantsKeys } from "../api/tenants.keys";
import type { Tenant } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedTenantsData {
  columnDefs: GridColDef<Tenant>[];
  rowDefs: Tenant[];
}

export const useTenants = () => {
  const { data, error, isLoading } = useQuery<
    Tenant[],
    Error,
    TransformedTenantsData
  >({
    queryKey: tenantsKeys.list(),
    queryFn: () => TenantsApi.getAll(),
    retry: 0,
    select: (rows): TransformedTenantsData => {
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

      const rowDefs = rows.map((r) => ({ ...r, id: r.identifier }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    tenantsRows: data?.rowDefs ?? [],
    tenantsColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
