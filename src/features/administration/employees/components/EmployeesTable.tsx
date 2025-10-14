import { useMemo, useState, useCallback } from "react";
import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridActionsCellItemProps,
  type GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { Employee } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useEmployees } from "../hooks/useEmployees";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";
import { useCan, PermissionGate } from "../../../../lib/permissions";

export default function EmployeesTable() {
  const { employeeColumns, employeeRows, error, isLoading } = useEmployees();
  const {
    mutate: deleteEmployee,
    isPending: busy,
    variables,
  } = useDeleteEmployee();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEmployee, setPendingEmployee] = useState<Employee | null>(null);

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

    const actionsCol: GridActionsColDef<Employee> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 120,
      getActions: (
        params: GridRowParams<Employee>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const e = params.row;
        const isDeletingThis = busy && (variables as any) === e.id;

        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Uredi zaposlenika">
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label="Uredi"
              onClick={() => handleEdit(e.id)}
              showInMenu={false}
            />
          );
        }

        if (canDelete) {
          items.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Izbriši zaposlenika">
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label="Izbriši"
              disabled={isDeletingThis}
              onClick={() => requestDelete(e)}
              showInMenu={false}
            />
          );
        }

        return items;
      },
    };

    return [...base, actionsCol];
  }, [employeeColumns, can, busy, variables, handleEdit, requestDelete]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) return <div>Zaposlenici.</div>;

  return (
    <>
      <ReusableDataGrid<Employee>
        rows={employeeRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading} // ✅ added loading state
      />

      <PermissionGate guard={{ permission: "Permission.Employees.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title="Izbriši zaposlenika?"
          description="Jeste li sigurni da želite izbrisati zaposlenika?"
          confirmText="Obriši"
          cancelText="Odustani"
          loading={busy}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
