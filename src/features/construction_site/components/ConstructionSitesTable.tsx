import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridRowParams,
  type GridActionsCellItemProps,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { ConstructionSite } from "..";
import { useNavigate } from "react-router-dom";
import { useConstructionSites } from "../hooks/useConstructionSites";
import { useDeleteConstructionSite } from "../hooks/useDeleteConstructionSite";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

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

    const actionsCol: GridActionsColDef<ConstructionSite> = {
      field: "actions",
      type: "actions",
      headerName: t("constructionSites.actions"),
      width: 200,
      getActions: (
        params: GridRowParams<ConstructionSite>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteConstructionSite.isPending;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canDetails) {
          items.push(
            <GridActionsCellItem
              key="details"
              icon={
                <Tooltip
                  title={t("constructionSites.table.detailView", {
                    defaultValue: "Pregled gradilišta",
                  })}
                >
                  <VisibilityIcon fontSize="small" />
                </Tooltip>
              }
              label={t("constructionSites.table.detailView", {
                defaultValue: "Pregled gradilišta",
              })}
              disabled={busy}
              onClick={() => navigate(`${id}/details`)}
              showInMenu={false}
            />
          );
        }

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title={t("constructionSites.table.edit")}>
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label={t("constructionSites.table.edit")}
              disabled={busy}
              onClick={() => navigate(`${id}/edit`)}
              showInMenu={false}
            />
          );
        }

        if (canDelete) {
          items.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title={t("constructionSites.table.delete")}>
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label={t("constructionSites.table.delete")}
              disabled={busy}
              onClick={() => requestDelete(row)}
              showInMenu={false}
            />
          );
        }

        return items;
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
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
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
