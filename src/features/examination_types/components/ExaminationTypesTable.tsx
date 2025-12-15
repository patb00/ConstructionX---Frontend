import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";

import type { ExaminationType } from "..";
import { useNavigate } from "react-router-dom";
import { useExaminationTypes } from "../hooks/useExaminationTypes";
import { useDeleteExaminationType } from "../hooks/useDeleteExaminationType";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function ExaminationTypesTable() {
  const { t } = useTranslation();
  const { examinationTypesRows, examinationTypesColumns, error, isLoading } =
    useExaminationTypes();

  const deleteExaminationType = useDeleteExaminationType();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<ExaminationType | null>(null);

  const requestDelete = useCallback((row: ExaminationType) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteExaminationType.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteExaminationType.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteExaminationType.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteExaminationType, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<ExaminationType>[]>(() => {
    const base = examinationTypesColumns.map((c) => {
      if (c.field === "examinationTypeName") {
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
        } as GridColDef<ExaminationType>;
      }
      return c;
    });

    const canEdit = can({
      permission: "Permission.ExaminationTypes.Update",
    });
    const canDelete = can({
      permission: "Permission.ExaminationTypes.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<ExaminationType> = {
      field: "actions",
      headerName: t("examinationTypes.actions"),
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteExaminationType.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            labels={{
              edit: t("examinationTypes.table.edit"),
              delete: t("examinationTypes.table.delete"),
            }}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    examinationTypesColumns,
    can,
    deleteExaminationType.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<ExaminationType>) => {
      return (
        <GridDetailPanel<ExaminationType>
          row={params.row}
          columns={examinationTypesColumns as GridColDef<ExaminationType>[]}
        />
      );
    },
    [examinationTypesColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<ExaminationType>) => 220,
    []
  );

  if (error) return <div>{t("examinationTypes.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<ExaminationType>
        storageKey="examination_types"
        rows={examinationTypesRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
      />

      <PermissionGate
        guard={{ permission: "Permission.ExaminationTypes.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("examinationTypes.delete.title")}
          description={t("examinationTypes.delete.description")}
          confirmText={t("examinationTypes.delete.confirm")}
          cancelText={t("examinationTypes.delete.cancel")}
          loading={deleteExaminationType.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
