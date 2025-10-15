// pages/ConstructionSitesTable.tsx
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
import type { ConstructionSite } from "..";
import { useNavigate } from "react-router-dom";
import { useConstructionSites } from "../hooks/useConstructionSites";
import { useDeleteConstructionSite } from "../hooks/useDeleteConstructionSite";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";

export default function ConstructionSitesTable() {
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

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridActionsColDef<ConstructionSite> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 140,
      getActions: (
        params: GridRowParams<ConstructionSite>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteConstructionSite.isPending;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Uredi gradilište">
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label="Uredi"
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
                <Tooltip title="Izbriši gradilište">
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label="Izbriši"
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
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>Neuspjelo učitavanje gradilišta.</div>;

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
          title="Izbriši gradilište?"
          description="Jeste li sigurni da želite izbrisati gradilište?"
          confirmText="Obriši"
          cancelText="Odustani"
          loading={deleteConstructionSite.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
