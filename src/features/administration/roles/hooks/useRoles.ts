import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "../api/roles.keys";
import { RolesApi } from "../api/roles.api";
import type { GridColDef } from "@mui/x-data-grid";
import type { Role } from "..";

interface TransformedRolesData {
  columnDefs: GridColDef<Role>[];
  rowDefs: Role[];
}

export const useRoles = () => {
  const { data, error, isLoading } = useQuery<
    Role[],
    Error,
    TransformedRolesData
  >({
    queryKey: rolesKeys.list(),
    queryFn: () => RolesApi.getAll(),
    select: (rows): TransformedRolesData => {
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
    rolesRows: data?.rowDefs ?? [],
    rolesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
