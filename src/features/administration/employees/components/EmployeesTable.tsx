import { useMemo, useState, useCallback } from "react";
import { type GridColDef, type GridRowId } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Employee } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useEmployees } from "../hooks/useEmployees";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { useCan, PermissionGate } from "../../../../lib/permissions";
import { RowActions } from "../../../../components/ui/datagrid/RowActions";
import { EmployeeHistoryDetails } from "./EmployeeHistoryDetails";

export default function EmployeesTable() {
  const { t } = useTranslation();
  const {
    employeeColumns,
    employeeRows,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useEmployees();
  const {
    mutate: deleteEmployee,
    isPending: busy,
    variables,
  } = useDeleteEmployee();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEmployee, setPendingEmployee] = useState<Employee | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<GridRowId>>(
    () => new Set()
  );

  const requestDelete = useCallback((employee: Employee) => {
    setPendingEmployee(employee);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (busy) return;
    setConfirmOpen(false);
    setPendingEmployee(null);
  }, [busy]);

  const handleConfirm = useCallback(() => {
    if (!pendingEmployee) return;
    deleteEmployee(pendingEmployee.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingEmployee(null);
      },
    });
  }, [deleteEmployee, pendingEmployee]);

  const handleEdit = useCallback(
    (employeeId: number) => navigate(`${employeeId}/edit`),
    [navigate]
  );

  const columnsWithActions = useMemo<GridColDef<Employee>[]>(() => {
    const base = employeeColumns.slice();

    const canEdit = can({ permission: "Permission.Employees.Update" });
    const canDelete = can({ permission: "Permission.Employees.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Employee> = {
      field: "actions",
      headerName: t("employees.actions"),
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const e = params.row;
        const isDeletingThis = busy && (variables as any) === e.id;

        return (
          <RowActions
            color="#F1B103"
            disabled={isDeletingThis}
            labels={{
              edit: t("employees.table.edit"),
              delete: t("employees.table.delete"),
            }}
            onEdit={canEdit ? () => handleEdit(e.id) : undefined}
            onDelete={canDelete ? () => requestDelete(e) : undefined}
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [employeeColumns, can, busy, variables, handleEdit, requestDelete, t]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback((params: GridRowParams<Employee>) => {
    const employeeId = Number(params.row.id);
    return <EmployeeHistoryDetails employeeId={employeeId} />;
  }, []);

  const getDetailPanelHeight = useCallback(() => "auto" as const, []);

  if (error) return <div>{t("employees.list.error")}</div>;

  return (
    <>
      <ReusableDataGrid<Employee>
        storageKey="employees"
        rows={employeeRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="desktop-only"
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        detailPanelExpandedRowIds={expandedIds}
        onDetailPanelExpandedRowIdsChange={(ids) => {
          const arr = Array.from(ids as Set<GridRowId>);
          setExpandedIds(new Set(arr.slice(-1)));
        }}
      />

      <PermissionGate guard={{ permission: "Permission.Employees.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("employees.delete.title")}
          description={t("employees.delete.description")}
          confirmText={t("employees.delete.confirm")}
          cancelText={t("employees.delete.cancel")}
          loading={busy}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
