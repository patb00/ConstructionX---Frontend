import { useMemo, useState, useCallback } from "react";
import { Tooltip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { Employee } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useEmployees } from "../hooks/useEmployees";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";

export default function EmployeesTable() {
  const { employeeColumns, employeeRows, error } = useEmployees();
  const { mutate: deleteEmployee, isPending: busy } = useDeleteEmployee();
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEmployee, setPendingEmployee] = useState<Employee | null>(null);

  const requestDelete = useCallback((employee: Employee) => {
    setPendingEmployee(employee);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmOpen(false);
    setPendingEmployee(null);
  }, []);

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
    if (employeeColumns.some((c) => c.field === "actions"))
      return employeeColumns;

    return [
      ...employeeColumns,
      {
        field: "actions",
        type: "actions",
        headerName: "Akcije",
        width: 110,
        getActions: (params) => [
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title="Uredi zaposlenika">
                <EditIcon fontSize="small" />
              </Tooltip>
            }
            label="Uredi"
            onClick={() => handleEdit(params.row.id)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Tooltip title="Izbriši zaposlenika">
                <DeleteIcon fontSize="small" color="error" />
              </Tooltip>
            }
            label="Izbriši"
            disabled={busy}
            onClick={() => requestDelete(params.row)}
            showInMenu={false}
          />,
        ],
      },
    ];
  }, [employeeColumns, handleEdit, requestDelete, busy]);

  if (error) return <div>Neuspjelo učitavanje zaposlenika.</div>;

  return (
    <>
      <ReusableDataGrid<Employee>
        rows={employeeRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        stickyRightField="actions"
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Izbriši zaposlenika?"
        description={`Jeste li sigurni da želite izbrisati zaposlenika ?`}
        confirmText="Obriši"
        cancelText="Odustani"
        loading={busy}
        disableBackdropClose
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
