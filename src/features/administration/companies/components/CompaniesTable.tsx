import { useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";

import { useCompanies } from "../hooks/useCompanies";
import { useDeleteCompany } from "../hooks/useDeleteCompany";
import type { Company } from "..";
import { PermissionGate, useCan } from "../../../../lib/permissions";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";

export default function CompaniesTable() {
  const { t } = useTranslation();
  const { companiesColumns, companiesRows, error, isLoading } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCompany, setPendingCompany] = useState<Company | null>(null);

  const requestDelete = useCallback((c: Company) => {
    setPendingCompany(c);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteCompany.isPending) return;
    setConfirmOpen(false);
    setPendingCompany(null);
  }, [deleteCompany.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingCompany) return;
    deleteCompany.mutate(pendingCompany.id as number, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingCompany(null);
      },
    });
  }, [deleteCompany, pendingCompany]);

  const columnsWithActions = useMemo<GridColDef<Company>[]>(() => {
    const base = companiesColumns.map((c) => {
      if (c.field === "dateOfCreation") {
        return {
          ...c,
          headerName: c.headerName ?? t("companies.table.dateOfCreation"),
          type: "dateTime",
          valueGetter: (_v, row) =>
            row.dateOfCreation ? new Date(row.dateOfCreation) : null,
          renderCell: (params) => (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {params.row.dateOfCreation
                ? new Date(params.row.dateOfCreation).toLocaleString()
                : ""}
            </Box>
          ),
        } as GridColDef<Company>;
      }
      return c;
    });

    const canEdit = can({ permission: "Permission.Companies.Update" });
    const canDelete = can({ permission: "Permission.Companies.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Company> = {
      field: "actions",
      headerName: t("companies.actions"),
      width: 160,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { row } = params;
        const busy = deleteCompany.isPending;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${row.id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(row) : undefined}
            labels={{
              edit: t("companies.table.edit"),
              delete: t("companies.table.delete"),
            }}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    companiesColumns,
    can,
    deleteCompany.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<Company>) => {
      return (
        <GridDetailPanel<Company>
          row={params.row}
          columns={companiesColumns as GridColDef<Company>[]}
        />
      );
    },
    [companiesColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<Company>) => 220,
    []
  );

  if (error) return <div>{t("companies.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<Company>
        rows={companiesRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
      />

      <PermissionGate guard={{ permission: "Permission.Companies.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("companies.delete.title")}
          description={t("companies.delete.description")}
          confirmText={t("companies.delete.confirm")}
          cancelText={t("companies.delete.cancel")}
          loading={deleteCompany.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
