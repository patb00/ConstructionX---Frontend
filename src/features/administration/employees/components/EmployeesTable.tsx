import { useMemo, useCallback } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { Employee } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useEmployees } from "../hooks/useEmployees";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";

export default function EmployeesTable() {
  const { employeeColumns, employeeRows, error } = useEmployees();
  const { mutate: deleteEmployee, isPending: busy } = useDeleteEmployee();
  const navigate = useNavigate();

  const handleDelete = useCallback(
    (employeeId: number) => deleteEmployee(employeeId),
    [deleteEmployee]
  );

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
        headerName: "Actions",
        width: 110,
        getActions: (params) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon fontSize="small" />}
            label="Edit"
            onClick={() => handleEdit(params.row.id)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon fontSize="small" color="error" />}
            label="Delete"
            disabled={busy}
            onClick={() => handleDelete(params.row.id)}
            showInMenu={false}
          />,
        ],
      },
    ];
  }, [employeeColumns, handleEdit, handleDelete, busy]);

  if (error) return <div>Failed to load employees</div>;

  return (
    <ReusableDataGrid<Employee>
      rows={employeeRows}
      columns={columnsWithActions}
      getRowId={(r) => r.id}
      stickyRightField="actions"
    />
  );
}
