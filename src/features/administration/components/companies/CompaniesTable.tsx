import { useMemo } from "react";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import { useCompanies } from "../../hooks/companies/useCompanies";

type Company = {
  id: number | string;
  name: string;
  dateOfCreation: string;
};

function isCompanyArray(x: unknown): x is Company[] {
  return (
    Array.isArray(x) &&
    x.every(
      (r: any) => r && (typeof r.id === "number" || typeof r.id === "string")
    )
  );
}

function extractRows(data: unknown): Company[] {
  if (isCompanyArray(data)) return data;
  const items = (data as any)?.items ?? (data as any)?.data;
  return isCompanyArray(items) ? items : [];
}

export default function CompaniesTable() {
  const { data } = useCompanies();
  const rows = useMemo(() => extractRows(data), [data]);
  const columns = useMemo<GridColDef<Company>[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        flex: 1,
        minWidth: 140,
        sortable: true,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1.2,
        minWidth: 160,
        sortable: true,
      },
      {
        field: "dateOfCreation",
        headerName: "Date of creation",
        flex: 1.8,
        minWidth: 260,
        sortable: true,
      },
    ],
    []
  );

  console.log("data", data, "rows", rows, "columns", columns);

  return (
    <ReusableDataGrid<Company>
      rows={rows}
      columns={columns}
      getRowId={(r) => r.id}
      pageSize={10}
    />
  );
}
