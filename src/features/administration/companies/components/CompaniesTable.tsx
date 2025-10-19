import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  type GridActionsCellItemProps,
  type GridActionsColDef,
  type GridColDef,
  type GridRowParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../hooks/useCompanies";
import { useDeleteCompany } from "../hooks/useDeleteCompany";
import type { Company } from "..";
import { PermissionGate, useCan } from "../../../../lib/permissions";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

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

    const actionsCol: GridActionsColDef<Company> = {
      field: "actions",
      type: "actions",
      headerName: t("companies.actions"),
      width: 160,
      getActions: (
        params: GridRowParams<Company>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const { row } = params;
        const busy = deleteCompany.isPending;
        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title={t("companies.table.edit")}>
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label={t("companies.table.edit")}
              disabled={busy}
              onClick={() => navigate(`${row.id}/edit`)}
              showInMenu={false}
            />
          );
        }

        if (canDelete) {
          items.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title={t("companies.table.delete")}>
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label={t("companies.table.delete")}
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
    companiesColumns,
    can,
    deleteCompany.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>{t("companies.list.error")}</div>;

  console.log("companiesColumns", companiesColumns);

  return (
    <>
      <ReusableDataGrid<Company>
        rows={companiesRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
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
