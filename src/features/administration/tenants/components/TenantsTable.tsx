import * as React from "react";
import { Box, Chip, CircularProgress, Tooltip } from "@mui/material";
import {
  type GridColDef,
  GridActionsCellItem,
  type GridActionsColDef,
  type GridActionsCellItemProps,
  type GridRowParams,
} from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

import { useActivateTenant } from "../hooks/useActivateTenant";
import { useDeactivateTenant } from "../hooks/useDeactivateTenant";
import { useTenants } from "../hooks/useTenants";
import type { Tenant } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useCan } from "../../../../lib/permissions";

export default function TenantsTable() {
  const { tenantsRows, tenantsColumns, error, isLoading } = useTenants();
  const activate = useActivateTenant();
  const deactivate = useDeactivateTenant();
  const navigate = useNavigate();
  const can = useCan();

  const columnsWithActions = React.useMemo<GridColDef<Tenant>[]>(() => {
    const base = tenantsColumns.map((c) => {
      if (c.field === "validUpToDate") {
        return {
          ...c,
          headerName: c.headerName ?? "Vrijedi do",
          flex: c.flex ?? 1.6,
          minWidth: c.minWidth ?? 220,
          sortable: true,
          type: "dateTime",
          valueGetter: (_v, row) =>
            row.validUpToDate ? new Date(row.validUpToDate) : null,
          sortComparator: (a, b) =>
            new Date(a as any).getTime() - new Date(b as any).getTime(),
          renderCell: (params) => {
            const t = params.row;
            const val = t.validUpToDate
              ? new Date(t.validUpToDate).toLocaleString()
              : "";
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span>{val}</span>
              </Box>
            );
          },
        } as GridColDef<Tenant>;
      }

      if (c.field === "isActive") {
        return {
          ...c,
          headerName: c.headerName ?? "Status",
          flex: c.flex ?? 1,
          minWidth: c.minWidth ?? 140,
          align: "center",
          headerAlign: "center",
          type: "singleSelect",
          valueOptions: ["Active", "Inactive"],
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
        } as GridColDef<Tenant>;
      }

      return c;
    });

    const canEdit = can({ permission: "Permission.Tenants.Update" });
    const canToggleActive = can({ permission: "Permission.Tenants.Update" });

    if (!(canEdit || canToggleActive)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridActionsColDef<Tenant> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 220,
      sortable: false,
      filterable: false,
      getActions: (
        params: GridRowParams<Tenant>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const t = params.row;

        const isActivating =
          activate.isPending && (activate.variables as any) === t.identifier;
        const isDeactivating =
          deactivate.isPending &&
          (deactivate.variables as any) === t.identifier;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Uredi tenanta">
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label="Uredi tenanta"
              onClick={() => navigate(`${t.identifier}/edit`)}
              showInMenu={false}
            />
          );
        }

        if (canToggleActive) {
          if (t.isActive) {
            items.push(
              <GridActionsCellItem
                key="deactivate"
                icon={
                  <Tooltip title="Deaktiviraj tenanta">
                    {isDeactivating ? (
                      <CircularProgress size={16} />
                    ) : (
                      <BlockIcon fontSize="small" />
                    )}
                  </Tooltip>
                }
                label="Deaktiviraj tenanta"
                disabled={isDeactivating}
                onClick={() => deactivate.mutate(t.identifier)}
                showInMenu={false}
              />
            );
          } else {
            items.push(
              <GridActionsCellItem
                key="activate"
                icon={
                  <Tooltip title="Aktiviraj tenanta">
                    {isActivating ? (
                      <CircularProgress size={16} />
                    ) : (
                      <CheckIcon fontSize="small" />
                    )}
                  </Tooltip>
                }
                label="Aktiviraj tenanta"
                disabled={isActivating}
                onClick={() => activate.mutate(t.identifier)}
                showInMenu={false}
              />
            );
          }
        }

        return items;
      },
    };

    return [...base, actionsCol];
  }, [
    tenantsColumns,
    can,
    activate.isPending,
    activate.variables,
    deactivate.isPending,
    deactivate.variables,
    navigate,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>Tenanti.</div>;

  return (
    <ReusableDataGrid<Tenant>
      rows={tenantsRows}
      columns={columnsWithActions}
      getRowId={(r) => r.identifier}
      stickyRightField={hasActions ? "actions" : undefined}
      loading={!!isLoading}
    />
  );
}
