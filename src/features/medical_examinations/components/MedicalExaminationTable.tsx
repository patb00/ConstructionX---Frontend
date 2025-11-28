import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";

import type { MedicalExamination } from "..";
import { useNavigate } from "react-router-dom";
import { useMedicalExaminations } from "../hooks/useMedicalExaminations";
import { useDeleteMedicalExamination } from "../hooks/useDeleteMedicalExamination";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function MedicalExaminationsTable() {
  const { t } = useTranslation();
  const {
    medicalExaminationsRows,
    medicalExaminationsColumns,
    error,
    isLoading,
  } = useMedicalExaminations();

  const deleteMedicalExamination = useDeleteMedicalExamination();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<MedicalExamination | null>(null);

  const requestDelete = useCallback((row: MedicalExamination) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteMedicalExamination.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteMedicalExamination.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteMedicalExamination.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteMedicalExamination, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<MedicalExamination>[]>(() => {
    const base = medicalExaminationsColumns.map((c) => {
      if (c.field === "result" || c.field === "note") {
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
        } as GridColDef<MedicalExamination>;
      }
      return c;
    });

    const canEdit = can({
      permission: "Permission.MedicalExaminations.Update",
    });
    const canDelete = can({
      permission: "Permission.MedicalExaminations.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<MedicalExamination> = {
      field: "actions",
      headerName: t("medicalExaminations.actions"),
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteMedicalExamination.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            labels={{
              view: t("medicalExaminations.table.detailView"),
              edit: t("medicalExaminations.table.edit"),
              delete: t("medicalExaminations.table.delete"),
            }}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    medicalExaminationsColumns,
    can,
    deleteMedicalExamination.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<MedicalExamination>) => {
      return (
        <GridDetailPanel<MedicalExamination>
          row={params.row}
          columns={
            medicalExaminationsColumns as GridColDef<MedicalExamination>[]
          }
        />
      );
    },
    [medicalExaminationsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<MedicalExamination>) => 220,
    []
  );

  if (error) return <div>{t("medicalExaminations.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<MedicalExamination>
        rows={medicalExaminationsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
      />

      <PermissionGate
        guard={{ permission: "Permission.MedicalExaminations.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("medicalExaminations.delete.title")}
          description={t("medicalExaminations.delete.description")}
          confirmText={t("medicalExaminations.delete.confirm")}
          cancelText={t("medicalExaminations.delete.cancel")}
          loading={deleteMedicalExamination.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
