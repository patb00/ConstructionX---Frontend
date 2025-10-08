import { useQuery } from "@tanstack/react-query";
import { companiesKeys } from "../api/companies.keys";
import { CompaniesApi } from "../api/companies.api";
import type { Company } from "..";
import type { GridColDef } from "@mui/x-data-grid";

interface TransformedCompaniesData {
  columnDefs: GridColDef<Company>[];
  rowDefs: Company[];
}

export const useCompanies = () => {
  const { data, error, isLoading } = useQuery<
    Company[],
    Error,
    TransformedCompaniesData
  >({
    queryKey: companiesKeys.list(),
    queryFn: () => CompaniesApi.getAll(),
    select: (rows): TransformedCompaniesData => {
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
    companiesRows: data?.rowDefs ?? [],
    companiesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
