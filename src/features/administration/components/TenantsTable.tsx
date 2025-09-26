import * as React from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { type GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { useTenants } from "../hooks/useTenants";
import { useActivateTenant } from "../hooks/useActivateTenant";
import { useDeactivateTenant } from "../hooks/useDeactivateTenant";

type Tenant = {
  identifier: string;
  name: string | null;
  email: string | null;
  validUpToDate: string | null;
  isActive: boolean;
};

function isTenantArray(x: unknown): x is Tenant[] {
  return Array.isArray(x) && x.every((r) => typeof r?.identifier === "string");
}
function extractRows(data: unknown): Tenant[] {
  if (isTenantArray(data)) return data;
  const items = (data as any)?.items;
  return isTenantArray(items) ? items : [];
}

export default function TenantsTable() {
  const { data, isError, error } = useTenants();
  const navigate = useNavigate();

  const activate = useActivateTenant();
  const deactivate = useDeactivateTenant();

  const rows = React.useMemo(() => extractRows(data), [data]);

  const columns = React.useMemo<GridColDef<Tenant>[]>(
    () => [
      {
        field: "identifier",
        headerName: "Identifier",
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
        field: "email",
        headerName: "Email",
        flex: 1.4,
        minWidth: 200,
        sortable: true,
      },
      {
        field: "validUpToDate",
        headerName: "Valid Until",
        flex: 1.2,
        minWidth: 180,
        sortable: true,
        type: "dateTime",
        valueGetter: (_value, row) =>
          row.validUpToDate ? new Date(row.validUpToDate) : null,
        valueFormatter: (value: unknown) => {
          if (value instanceof Date) return value.toLocaleString();
          if (typeof value === "string")
            return new Date(value).toLocaleString();
          return "";
        },
        sortComparator: (a, b) =>
          new Date(a as any).getTime() - new Date(b as any).getTime(),
      },
      {
        field: "isActive",
        headerName: "Status",
        flex: 1,
        minWidth: 140,
        type: "singleSelect",
        valueOptions: ["Active", "Inactive"],
        align: "center",
        headerAlign: "center",
        valueGetter: (_value, row) => (row.isActive ? "Active" : "Inactive"),
        renderCell: (params) => {
          const active = params.row.isActive;
          return (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Chip
                size="small"
                label={active ? "Active" : "Inactive"}
                color={active ? "success" : "default"}
                variant={active ? "filled" : "outlined"}
                sx={{ lineHeight: 1 }}
              />
            </Box>
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        getActions: (params) => {
          const t = params.row;

          const isActivating =
            activate.isPending && (activate.variables as any) === t.identifier;
          const isDeactivating =
            deactivate.isPending &&
            (deactivate.variables as any) === t.identifier;
          const busy = isActivating || isDeactivating;

          return [
            <GridActionsCellItem
              key="open"
              icon={<OpenInNewIcon fontSize="small" />}
              label="Open"
              onClick={() =>
                navigate(`/app/administration/tenants/${t.identifier}`)
              }
              showInMenu={false}
            />,
            t.isActive ? (
              <GridActionsCellItem
                key="deactivate"
                icon={
                  isDeactivating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <BlockIcon fontSize="small" />
                  )
                }
                label={isDeactivating ? "Deactivating..." : "Deactivate"}
                disabled={busy}
                onClick={() => {
                  deactivate.mutate(t.identifier);
                }}
                showInMenu={false}
              />
            ) : (
              <GridActionsCellItem
                key="activate"
                icon={
                  isActivating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckIcon fontSize="small" />
                  )
                }
                label={isActivating ? "Activating..." : "Activate"}
                disabled={busy}
                onClick={() => {
                  activate.mutate(t.identifier);
                }}
                showInMenu={false}
              />
            ),
          ];
        },
        flex: 0.8,
        minWidth: 140,
        sortable: false,
        filterable: false,
      },
    ],
    [
      navigate,
      activate.isPending,
      activate.variables,
      deactivate.isPending,
      deactivate.variables,
    ]
  );

  if (isError) {
    console.error(error);
  }

  return (
    <ReusableDataGrid<Tenant>
      rows={rows}
      columns={columns}
      getRowId={(r) => r.identifier}
      pageSize={10}
    />
  );
}
