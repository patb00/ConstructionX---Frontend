import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";

import type { ConstructionSite } from "..";
import { useNavigate } from "react-router-dom";
import { useConstructionSites } from "../hooks/useConstructionSites";
import { useDeleteConstructionSite } from "../hooks/useDeleteConstructionSite";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../components/ui/datagrid/RowActions";
import { ConstructionSiteDetailPanel } from "./ConstructionSiteDetailPanel";

export default function ConstructionSitesTable() {
  const { t } = useTranslation();
  const { constructionSitesRows, constructionSitesColumns, error, isLoading } =
    useConstructionSites();
  const deleteConstructionSite = useDeleteConstructionSite();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<ConstructionSite | null>(null);

  const requestDelete = useCallback((row: ConstructionSite) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteConstructionSite.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteConstructionSite.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteConstructionSite.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteConstructionSite, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<ConstructionSite>[]>(() => {
    const base = constructionSitesColumns.map((c) => {
      if (
        c.field === "name" ||
        c.field === "location" ||
        c.field === "description"
      ) {
        return {
          ...c,
          renderCell: (params) => (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>{(params.value as string) ?? ""}</span>
            </Box>
          ),
        } as GridColDef<ConstructionSite>;
      }
      return c;
    });

    const canEdit = can({ permission: "Permission.ConstructionSites.Update" });
    const canDelete = can({
      permission: "Permission.ConstructionSites.Delete",
    });
    const canDetails = can({ permission: "Permission.ConstructionSites.Read" });

    if (!(canEdit || canDelete || canDetails)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<ConstructionSite> = {
      field: "actions",
      headerName: t("constructionSites.actions"),
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteConstructionSite.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            labels={{
              view: t("constructionSites.table.detailView"),
              edit: t("constructionSites.table.edit"),
              delete: t("constructionSites.table.delete"),
            }}
            onView={canDetails ? () => navigate(`${id}/details`) : undefined}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    constructionSitesColumns,
    can,
    deleteConstructionSite.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("constructionSites.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<ConstructionSite>
        rows={constructionSitesRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={(params) => (
          <ConstructionSiteDetailPanel
            constructionSiteId={Number((params.row as any).id)}
          />
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
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
