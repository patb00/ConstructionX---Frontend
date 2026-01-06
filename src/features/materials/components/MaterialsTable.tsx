import { useMemo, useState, useCallback } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useDeleteMaterial } from "../hooks/useDeleteMaterial";
import { useMaterials } from "../hooks/useMaterials";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { Material } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function MaterialsTable() {
  const { t } = useTranslation();
  const {
    materialsRows,
    materialsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useMaterials();

  const deleteMaterial = useDeleteMaterial();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Material | null>(null);

  const requestDelete = useCallback((row: Material) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteMaterial.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteMaterial.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;

    deleteMaterial.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteMaterial, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<Material>[]>(() => {
    const base = [...materialsColumns];

    const canEdit = can({ permission: "Permission.Materials.Update" });
    const canDelete = can({ permission: "Permission.Materials.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Material> = {
      field: "actions",
      headerName: t("materials.actions"),
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteMaterial.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
            labels={{
              edit: t("materials.table.edit"),
              delete: t("materials.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [materialsColumns, can, deleteMaterial.isPending, navigate, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("materials.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<Material>
        storageKey="materials"
        rows={materialsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <PermissionGate guard={{ permission: "Permission.Materials.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("materials.delete.title")}
          description={t("materials.delete.description")}
          confirmText={t("materials.delete.confirm")}
          cancelText={t("materials.delete.cancel")}
          loading={deleteMaterial.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
