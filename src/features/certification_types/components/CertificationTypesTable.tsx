import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";

import type { CertificationType } from "..";
import { useNavigate } from "react-router-dom";
import { useCertificationTypes } from "../hooks/useCertificationTypes";
import { useDeleteCertificationType } from "../hooks/useDeleteCertificationType";
import { PermissionGate, useCan } from "../../../lib/permissions";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

export default function CertificationTypesTable() {
  const { t } = useTranslation();
  const { certificationTypesRows, certificationTypesColumns, error, isLoading } =
    useCertificationTypes();

  const deleteCertificationType = useDeleteCertificationType();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<CertificationType | null>(null);

  const requestDelete = useCallback((row: CertificationType) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteCertificationType.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteCertificationType.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteCertificationType.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteCertificationType, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<CertificationType>[]>(() => {
    const base = certificationTypesColumns.map((c) => {
      if (c.field === "certificationTypeName") {
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
        } as GridColDef<CertificationType>;
      }
      return c;
    });

    const canEdit = can({
      permission: "Permission.CertificationTypes.Update",
    });
    const canDelete = can({
      permission: "Permission.CertificationTypes.Delete",
    });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<CertificationType> = {
      field: "actions",
      headerName: t("certificationTypes.actions"),
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const id = (row as any).id;
        const busy = deleteCertificationType.isPending;

        return (
          <RowActions
            disabled={busy}
            color="#F1B103"
            labels={{
              edit: t("certificationTypes.table.edit"),
              delete: t("certificationTypes.table.delete"),
            }}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    certificationTypesColumns,
    can,
    deleteCertificationType.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<CertificationType>) => {
      return (
        <GridDetailPanel<CertificationType>
          row={params.row}
          columns={certificationTypesColumns as GridColDef<CertificationType>[]}
        />
      );
    },
    [certificationTypesColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<CertificationType>) => 220,
    []
  );

  if (error) return <div>{t("certificationTypes.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<CertificationType>
        storageKey="certification_types"
        rows={certificationTypesRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
      />

      <PermissionGate
        guard={{ permission: "Permission.CertificationTypes.Delete" }}
      >
        <ConfirmDialog
          open={confirmOpen}
          title={t("certificationTypes.delete.title")}
          description={t("certificationTypes.delete.description")}
          confirmText={t("certificationTypes.delete.confirm")}
          cancelText={t("certificationTypes.delete.cancel")}
          loading={deleteCertificationType.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
