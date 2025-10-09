import { useMemo, useState, useCallback } from "react";
import { Box, Tooltip } from "@mui/material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCompanies } from "../hooks/useCompanies";
import { useDeleteCompany } from "../hooks/useDeleteCompany";
import type { Company } from "..";
import ReusableDataGrid from "../../../../components/ui/datagrid/ReusableDataGrid";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../../components/ui/confirm-dialog/ConfirmDialog";

export default function CompaniesTable() {
  const { companiesColumns, companiesRows, error } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const navigate = useNavigate();

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
      onError: () => {},
    });
  }, [deleteCompany, pendingCompany]);

  const columnsWithActions = useMemo<GridColDef<Company>[]>(() => {
    const base = companiesColumns.map((c) => {
      if (c.field === "dateOfCreation") {
        return {
          ...c,
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

    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<Company> = {
      field: "actions",
      type: "actions",
      headerName: "Akcije",
      width: 160,
      getActions: (params) => {
        const row = params.row;
        const busy = deleteCompany.isPending;

        return [
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title="Uredi tvrtku">
                <EditIcon fontSize="small" />
              </Tooltip>
            }
            label="Uredi tvrtku"
            disabled={busy}
            onClick={() => navigate(`${row.id}/edit`)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Tooltip title="Izbriši tvrtku">
                <DeleteIcon fontSize="small" color="error" />
              </Tooltip>
            }
            label="Obriši"
            disabled={busy}
            onClick={() => requestDelete(row)}
            showInMenu={false}
          />,
        ];
      },
    };

    return [...base, actionsCol];
  }, [companiesColumns, deleteCompany.isPending, navigate, requestDelete]);

  if (error) return <div>Failed to load companies</div>;

  return (
    <>
      <ReusableDataGrid<Company>
        rows={companiesRows}
        columns={columnsWithActions}
        getRowId={(r) => r.id}
        stickyRightField="actions"
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Obriši tvrtku?"
        description={`Jeste li sigurni da želite obrisati tvrtku ? Ova radnja je nepovratna.`}
        confirmText="Obriši"
        cancelText="Odustani"
        loading={deleteCompany.isPending}
        disableBackdropClose
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
