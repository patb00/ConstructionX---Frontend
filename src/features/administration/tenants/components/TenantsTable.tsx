import { Box, Chip } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";

import { useActivateTenant } from "../hooks/useActivateTenant";
import { useDeactivateTenant } from "../hooks/useDeactivateTenant";
import { useTenants } from "../hooks/useTenants";
import type { Tenant } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../../components/ui/datagrid/GridDetailPanel";
import { useCan } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";
import { useCallback, useMemo } from "react";

export default function TenantsTable() {
  const { t } = useTranslation();
  const { tenantsRows, tenantsColumns, error, isLoading } = useTenants();
  const activate = useActivateTenant();
  const deactivate = useDeactivateTenant();
  const navigate = useNavigate();
  const can = useCan();

  const columnsWithActions = useMemo<GridColDef<Tenant>[]>(() => {
    const base = tenantsColumns.map((c) => {
      if (c.field === "validUpToDate") {
        return {
          ...c,
          headerName: c.headerName ?? t("tenants.table.validUntil"),
          flex: c.flex ?? 1.6,
          minWidth: c.minWidth ?? 220,
          sortable: true,
          type: "dateTime",
          valueGetter: (_v, row) =>
            row.validUpToDate ? new Date(row.validUpToDate) : null,
          sortComparator: (a, b) => {
            const da = a ? new Date(a as any).getTime() : 0;
            const db = b ? new Date(b as any).getTime() : 0;
            return da - db;
          },
          renderCell: (params) => {
            const tRow = params.row;
            const val = tRow.validUpToDate
              ? new Date(tRow.validUpToDate).toLocaleString()
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
          headerName: c.headerName ?? t("tenants.table.statusHeader"),
          flex: c.flex ?? 1,
          minWidth: c.minWidth ?? 140,
          align: "center",
          headerAlign: "center",
          type: "singleSelect",
          valueOptions: [
            t("tenants.table.status.active"),
            t("tenants.table.status.inactive"),
          ],
          valueGetter: (_value, row) =>
            row.isActive
              ? t("tenants.table.status.active")
              : t("tenants.table.status.inactive"),
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
                  label={
                    active
                      ? t("tenants.table.status.active")
                      : t("tenants.table.status.inactive")
                  }
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

    const actionsCol: GridColDef<Tenant> = {
      field: "actions",
      headerName: t("tenants.actions"),
      width: 220,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const tRow = params.row;

        const isActivating =
          activate.isPending && (activate.variables as any) === tRow.identifier;
        const isDeactivating =
          deactivate.isPending &&
          (deactivate.variables as any) === tRow.identifier;

        const toggleLoading = isActivating || isDeactivating;
        const busy = toggleLoading;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={
              canEdit ? () => navigate(`${tRow.identifier}/edit`) : undefined
            }
            onToggleActive={
              canToggleActive
                ? () => {
                    if (tRow.isActive) {
                      deactivate.mutate(tRow.identifier);
                    } else {
                      activate.mutate(tRow.identifier);
                    }
                  }
                : undefined
            }
            isActive={tRow.isActive}
            toggleLoading={toggleLoading}
            labels={{
              edit: t("tenants.table.edit"),
              activate: t("tenants.table.activate"),
              deactivate: t("tenants.table.deactivate"),
            }}
          />
        );
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
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<Tenant>) => {
      return (
        <GridDetailPanel<Tenant>
          row={params.row}
          columns={tenantsColumns as GridColDef<Tenant>[]}
        />
      );
    },
    [tenantsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<Tenant>) => 220,
    []
  );

  if (error) return <div>{t("tenants.list.error")}</div>;

  return (
    <ReusableDataGrid<Tenant>
      rows={tenantsRows}
      columns={columnsWithActions}
      getRowId={(r) => r.identifier}
      pinnedRightField={hasActions ? "actions" : undefined}
      loading={!!isLoading}
      getDetailPanelContent={renderDetailPanel}
      getDetailPanelHeight={getDetailPanelHeight}
      detailPanelMode="mobile-only"
    />
  );
}
