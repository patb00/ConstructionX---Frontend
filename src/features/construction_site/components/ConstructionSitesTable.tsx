import { useMemo, useState, useCallback, useEffect } from "react";

import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { ConstructionSite } from "..";
import { useConstructionSites } from "../hooks/useConstructionSites";
import { useDeleteConstructionSite } from "../hooks/useDeleteConstructionSite";
import { useChangeConstructionSiteStatus } from "../hooks/useChangeConstructionSiteStatus";
import { useConstructionSiteStatusOptions } from "../../constants/enum/useConstructionSiteStatusOptions";

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

type Props = {
  statusValue: string;
};

export default function ConstructionSitesTable({ statusValue }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const deleteConstructionSite = useDeleteConstructionSite();
  const changeStatus = useChangeConstructionSiteStatus();

  const statusOptions = useConstructionSiteStatusOptions();
  const { employeeRows } = useEmployees();
  const { toolsRows } = useTools();
  const { vehiclesRows } = useVehicles();

  const employeeOptions = useMemo(
    () =>
      (employeeRows ?? []).map((e: any) => ({
        value: e.id,
        label: `${e.firstName} ${e.lastName}`.trim(),
      })),
    [employeeRows],
  );

  const toolOptions = useMemo(
    () =>
      (toolsRows ?? []).map((tool: any) => ({
        value: tool.id,
        label: tool.name ?? tool.model ?? `#${tool.id}`,
      })),
    [toolsRows],
  );

  const vehicleOptions = useMemo(
    () =>
      (vehiclesRows ?? []).map((v: any) => ({
        value: v.id,
        label:
          v.name ?? [v.brand, v.model].filter(Boolean).join(" ") ?? `#${v.id}`,
      })),
    [vehiclesRows],
  );

  const {
    constructionSitesRows,
    constructionSitesColumns,
    total,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    isLoading,
    error,
  } = useConstructionSites({
    statusOptions,
    employeeOptions,
    toolOptions,
    vehicleOptions,
  });

  useEffect(() => {
    setFilterModel((prev) => {
      const items = (prev.items ?? []).filter(
        (item) => item.field !== "status",
      );

      if (!statusValue) {
        return { ...prev, items };
      }

      return {
        ...prev,
        items: [
          ...items,
          {
            field: "status",
            operator: "equals",
            value: Number(statusValue),
          },
        ],
      };
    });

    setPaginationModel((p) => ({ ...p, page: 0 }));
  }, [statusValue, setFilterModel, setPaginationModel]);

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
        },
      );
    },
    [changeStatus, statusRow],
  );

  const columns = useMemo<GridColDef<ConstructionSite>[]>(() => {
    const base = constructionSitesColumns;

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
    constructionSitesColumns,
    can,
    t,
    navigate,
    deleteConstructionSite.isPending,
    changeStatus.isPending,
    requestDelete,
    handleOpenStatusDialog,
  ]);

  const hasActions = useMemo(
    () => columns.some((c) => c.field === "actions"),
    [columns],
  );

  const getDetailPanelHeight = useCallback(() => "auto" as const, []);

  if (error) return <div>{t("constructionSites.list.error")}</div>;

  console.log("constructionSitesRows", constructionSitesRows);

  return (
    <>
      <ReusableDataGrid<ConstructionSite>
        storageKey="construction_sites"
        rows={constructionSitesRows}
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
        getDetailPanelHeight={getDetailPanelHeight}
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
