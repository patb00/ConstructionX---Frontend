import { useMemo, useState, useCallback } from "react";
import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridActionsColDef,
  type GridRowParams,
  type GridActionsCellItemProps,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useVehicles } from "../hooks/useVehicles";
import { useDeleteVehicle } from "../hooks/useDeleteVehicle";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { Vehicle } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";

export default function VehiclesTable() {
  const { t } = useTranslation();
  const { vehiclesRows, vehiclesColumns, error, isLoading } = useVehicles();
  const deleteVehicle = useDeleteVehicle();
  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<Vehicle | null>(null);

  const requestDelete = useCallback((row: Vehicle) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteVehicle.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteVehicle.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteVehicle.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteVehicle, pendingRow]);

  const columnsWithActions = useMemo<GridColDef<Vehicle>[]>(() => {
    const base = vehiclesColumns;

    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({ permission: "Permission.Vehicles.Delete" });

    if (!(canEdit || canDelete)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridActionsColDef<Vehicle> = {
      field: "actions",
      type: "actions",
      headerName: t("vehicles.actions", { defaultValue: "Akcije" }),
      width: 150,
      getActions: (
        params: GridRowParams<Vehicle>
      ): readonly React.ReactElement<GridActionsCellItemProps>[] => {
        const id = (params.row as any).id;
        const busy = deleteVehicle.isPending;
        const items: React.ReactElement<GridActionsCellItemProps>[] = [];

        if (canEdit) {
          items.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip
                  title={t("vehicles.table.edit", { defaultValue: "Uredi" })}
                >
                  <EditIcon fontSize="small" />
                </Tooltip>
              }
              label="Edit"
              disabled={busy}
              onClick={() => navigate(`${id}/edit`)}
              showInMenu={false}
            />
          );
        }

        if (canDelete) {
          items.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip
                  title={t("vehicles.table.delete", { defaultValue: "Obriši" })}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </Tooltip>
              }
              label="Delete"
              disabled={busy}
              onClick={() => requestDelete(params.row)}
              showInMenu={false}
            />
          );
        }

        return items;
      },
    };

    return [...base, actionsCol];
  }, [
    vehiclesColumns,
    can,
    deleteVehicle.isPending,
    navigate,
    requestDelete,
    t,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  if (error) {
    return (
      <div>
        {t("vehicles.list.error", { defaultValue: "Greška kod učitavanja" })}
      </div>
    );
  }
  console.log("vehiclesColumns", vehiclesColumns);
  return (
    <>
      <ReusableDataGrid<Vehicle>
        rows={vehiclesRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        stickyRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
      />

      <PermissionGate guard={{ permission: "Permission.Vehicles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("vehicles.delete.title", {
            defaultValue: "Brisanje vozila",
          })}
          description={t("vehicles.delete.description", {
            defaultValue: "Jeste li sigurni?",
          })}
          confirmText={t("vehicles.delete.confirm", {
            defaultValue: "Potvrdi",
          })}
          cancelText={t("vehicles.delete.cancel", { defaultValue: "Odustani" })}
          loading={deleteVehicle.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
