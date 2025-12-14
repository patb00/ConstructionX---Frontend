import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { ConstructionSite } from "..";
import { useConstructionSites } from "../hooks/useConstructionSites";
import { useDeleteConstructionSite } from "../hooks/useDeleteConstructionSite";
import { useChangeConstructionSiteStatus } from "../hooks/useChangeConstructionSiteStatus";
import { useConstructionSiteStatusOptions } from "../hooks/useConstructionSiteStatusOptions";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useTools } from "../../tools/hooks/useTools";
import { useVehicles } from "../../vehicles/hooks/useVehicles";

import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { ConstructionSiteDetailPanel } from "./ConstructionSiteDetailPanel";
import {
  ChangeStatusDialog,
  type StatusOption,
} from "../../../components/ui/change-status-dialog/ChangeStatusDialog";

export default function ConstructionSitesTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const {
    rows,
    total,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    isLoading,
    error,
  } = useConstructionSites();

  const deleteConstructionSite = useDeleteConstructionSite();
  const changeStatus = useChangeConstructionSiteStatus();

  const statusOptions = useConstructionSiteStatusOptions();
  const { employeeRows } = useEmployees();
  const { toolsRows } = useTools();
  const { vehiclesRows } = useVehicles();

  const employeeOptions = useMemo(
    () =>
      (employeeRows ?? []).map((e) => ({
        value: e.id,
        label: `${e.firstName} ${e.lastName}`.trim(),
      })),
    [employeeRows]
  );

  const toolOptions = useMemo(
    () =>
      (toolsRows ?? []).map((t) => ({
        value: t.id,
        label: t.name ?? t.model ?? `#${t.id}`,
      })),
    [toolsRows]
  );

  const vehicleOptions = useMemo(
    () =>
      (vehiclesRows ?? []).map((v) => ({
        value: v.id,
        label:
          v.name ?? [v.brand, v.model].filter(Boolean).join(" ") ?? `#${v.id}`,
      })),
    [vehiclesRows]
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<ConstructionSite | null>(null);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusRow, setStatusRow] = useState<ConstructionSite | null>(null);

  const requestDelete = useCallback((row: ConstructionSite) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleteConstructionSite.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteConstructionSite.isPending]);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingRow) return;
    deleteConstructionSite.mutate(pendingRow.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteConstructionSite, pendingRow]);

  const handleOpenStatusDialog = useCallback((row: ConstructionSite) => {
    setStatusRow(row);
    setStatusDialogOpen(true);
  }, []);

  const handleCloseStatusDialog = useCallback(() => {
    if (changeStatus.isPending) return;
    setStatusDialogOpen(false);
    setStatusRow(null);
  }, [changeStatus.isPending]);

  const handleSaveStatus = useCallback(
    (newStatus: number) => {
      if (!statusRow) return;
      changeStatus.mutate(
        { id: statusRow.id, status: newStatus },
        {
          onSuccess: () => {
            setStatusDialogOpen(false);
            setStatusRow(null);
          },
        }
      );
    },
    [changeStatus, statusRow]
  );

  const columns = useMemo<GridColDef<ConstructionSite>[]>(() => {
    const base: GridColDef<ConstructionSite>[] = [
      { field: "name", headerName: t("common.columns.name"), width: 200 },
      {
        field: "location",
        headerName: t("common.columns.location"),
        width: 200,
      },

      {
        field: "status",
        headerName: t("common.columns.status"),
        type: "singleSelect",
        valueOptions: statusOptions,
        width: 140,
      },

      {
        field: "startDate",
        headerName: t("common.columns.startDate"),
        type: "date",
        width: 160,
        valueGetter: (value) => (value ? new Date(value as string) : null),
      },
      {
        field: "plannedEndDate",
        headerName: t("common.columns.plannedEndDate"),
        type: "date",
        width: 180,
        valueGetter: (value) => (value ? new Date(value as string) : null),
      },

      {
        field: "description",
        headerName: t("common.columns.description"),
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <span>{params.value ?? ""}</span>
          </Box>
        ),
      },

      {
        field: "siteManagerId",
        headerName: t("common.columns.siteManagerId"),
        type: "singleSelect",
        valueOptions: employeeOptions,
      },
      {
        field: "employeeId",
        headerName: t("common.columns.employeeId"),
        type: "singleSelect",
        valueOptions: employeeOptions,
      },
      {
        field: "toolId",
        headerName: t("common.columns.toolId"),
        type: "singleSelect",
        valueOptions: toolOptions,
      },
      {
        field: "vehicleId",
        headerName: t("common.columns.vehicleId"),
        type: "singleSelect",
        valueOptions: vehicleOptions,
      },
    ];

    const canEdit = can({ permission: "Permission.ConstructionSites.Update" });
    const canDelete = can({
      permission: "Permission.ConstructionSites.Delete",
    });
    const canRead = can({ permission: "Permission.ConstructionSites.Read" });
    const canChangeStatus = can({
      permission: "Permission.ConstructionSites.Update",
    });

    if (!(canEdit || canDelete || canRead || canChangeStatus)) return base;

    return [
      ...base,
      {
        field: "actions",
        headerName: t("constructionSites.actions"),
        width: 200,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const row = params.row as ConstructionSite;
          const busy =
            deleteConstructionSite.isPending || changeStatus.isPending;

          return (
            <RowActions
              disabled={busy}
              color="#F1B103"
              labels={{
                view: t("constructionSites.table.detailView"),
                edit: t("constructionSites.table.edit"),
                delete: t("constructionSites.table.delete"),
                status: t("constructionSites.table.changeStatus"),
              }}
              onView={canRead ? () => navigate(`${row.id}/details`) : undefined}
              onEdit={canEdit ? () => navigate(`${row.id}/edit`) : undefined}
              onDelete={canDelete ? () => requestDelete(row) : undefined}
              onChangeStatus={
                canChangeStatus ? () => handleOpenStatusDialog(row) : undefined
              }
            />
          );
        },
      },
    ];
  }, [
    t,
    can,
    navigate,
    statusOptions,
    employeeOptions,
    toolOptions,
    vehicleOptions,
    deleteConstructionSite.isPending,
    changeStatus.isPending,
    requestDelete,
    handleOpenStatusDialog,
  ]);

  const hasActions = useMemo(
    () => columns.some((c) => c.field === "actions"),
    [columns]
  );

  if (error) return <div>{t("constructionSites.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<ConstructionSite>
        rows={rows}
        columns={columns}
        getRowId={(r) => String(r.id)}
        loading={isLoading}
        paginationMode="server"
        filterMode="server"
        rowCount={total}
        pinnedRightField={hasActions ? "actions" : undefined}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        getDetailPanelContent={(params) => (
          <ConstructionSiteDetailPanel constructionSiteId={params.row.id} />
        )}
        getDetailPanelHeight={() => 400}
      />

      <PermissionGate
        guard={{ permission: "Permission.ConstructionSites.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("constructionSites.delete.title")}
          description={t("constructionSites.delete.description")}
          confirmText={t("constructionSites.delete.confirm")}
          cancelText={t("constructionSites.delete.cancel")}
          loading={deleteConstructionSite.isPending}
          disableBackdropClose
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </PermissionGate>

      <PermissionGate
        guard={{ permission: "Permission.ConstructionSites.Update" }}
      >
        <ChangeStatusDialog
          open={statusDialogOpen}
          title={t("constructionSites.status.dialogTitle")}
          currentStatus={statusRow?.status ?? null}
          options={statusOptions as StatusOption[]}
          loading={changeStatus.isPending}
          onClose={handleCloseStatusDialog}
          onSave={handleSaveStatus}
          saveLabel={t("constructionSites.form.submit")}
          cancelLabel={t("constructionSites.delete.cancel")}
        />
      </PermissionGate>
    </>
  );
}
