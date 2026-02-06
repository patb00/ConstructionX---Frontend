import { useMemo, useState, useCallback } from "react";
import { type GridColDef } from "@mui/x-data-grid";
import { type GridRowParams } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useTheme } from "@mui/material";

import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import { useVehicleRegistrations } from "../hooks/useVehicleRegistrations";
import { useVehicleRegistration } from "../hooks/useVehicleRegistration";
import { useDeleteVehicleRegistration } from "../hooks/useDeleteVehicleRegistration";
import { PermissionGate, useCan } from "../../../lib/permissions";
import type { VehicleRegistration } from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import { GridDetailPanel } from "../../../components/ui/datagrid/GridDetailPanel";
import ConfirmDialog from "../../../components/ui/confirm-dialog/ConfirmDialog";
import { RowActions } from "../../../components/ui/datagrid/RowActions";

import { useAddVehicleRegistrationEmployee } from "../../vehicle_registration_employee/hooks/useAddVehicleRegistrationEmployee";
import { useVehicleRegistrationEmployeesByVehicle } from "../../vehicle_registration_employee/hooks/useVehicleRegistrationEmployeesByVehicle";
import { useUpdateVehicleRegistrationEmployee } from "../../vehicle_registration_employee/hooks/useUpdateVehicleRegistrationEmployee";
import { useVehicle } from "../../vehicles/hooks/useVehicle";
import { dueSoonRowSx } from "../../../components/ui/datagrid/styles/dueSoonRowSx";
import { AssignVehicleRegistrationEmployeeDialog } from "./AssignVehicleRegistrationEmployeeDialog";

export default function VehicleRegistrationsTable() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    vehicleRegistrationsRows,
    vehicleRegistrationsColumns,
    total,
    paginationModel,
    setPaginationModel,
    error,
    isLoading,
  } = useVehicleRegistrations();

  const {
    options: employeeOptions,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useEmployeeOptions();

  const addMutation = useAddVehicleRegistrationEmployee();
  const deleteRegistration = useDeleteVehicleRegistration();

  const navigate = useNavigate();
  const can = useCan();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRow, setPendingRow] = useState<VehicleRegistration | null>(
    null
  );

  const [assignOpen, setAssignOpen] = useState(false);

  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    number | null
  >(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );

  const { data: selectedRegistration } = useVehicleRegistration(
    selectedRegistrationId ?? 0
  );

  const {
    data: registrationsByVehicle,
    isFetched: registrationsByVehicleFetched,
  } = useVehicleRegistrationEmployeesByVehicle(selectedVehicleId ?? 0);

  const { data: selectedVehicle, isLoading: vehicleLoading } = useVehicle(
    selectedVehicleId ?? 0
  );

  const existingAssignment = registrationsByVehicle?.[0];

  const formLoading =
    assignOpen && !!selectedVehicleId && !registrationsByVehicleFetched;

  const requestDelete = useCallback((row: VehicleRegistration) => {
    setPendingRow(row);
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (deleteRegistration.isPending) return;
    setConfirmOpen(false);
    setPendingRow(null);
  }, [deleteRegistration.isPending]);

  const handleConfirm = useCallback(() => {
    if (!pendingRow) return;
    const id = (pendingRow as any).id;
    deleteRegistration.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingRow(null);
      },
    });
  }, [deleteRegistration, pendingRow]);

  const updateMutation = useUpdateVehicleRegistrationEmployee();

  const openAssignDialog = useCallback((row: VehicleRegistration) => {
    setSelectedRegistrationId(row.id);
    setSelectedVehicleId(row.vehicleId);
    setAssignOpen(true);
  }, []);

  const closeAssignDialog = useCallback(() => {
    setAssignOpen(false);
  }, []);

  const handleAssignExited = useCallback(() => {
    setSelectedRegistrationId(null);
    setSelectedVehicleId(null);
  }, []);

  const columnsWithActions = useMemo<GridColDef<VehicleRegistration>[]>(() => {
    const base = vehicleRegistrationsColumns.slice();

    const canEdit = can({ permission: "Permission.Vehicles.Update" });
    const canDelete = can({ permission: "Permission.Vehicles.Delete" });
    const canAssign = canEdit;

    if (!(canEdit || canDelete || canAssign)) return base;
    if (base.some((c) => c.field === "actions")) return base;

    const actionsCol: GridColDef<VehicleRegistration> = {
      field: "actions",
      headerName: t("vehicleRegistrations.actions"),
      width: 190,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = (params.row as any).id;
        const busy = deleteRegistration.isPending;

        return (
          <RowActions
            color="#F1B103"
            disabled={busy}
            onEdit={canEdit ? () => navigate(`${id}/edit`) : undefined}
            onDelete={canDelete ? () => requestDelete(params.row) : undefined}
            customActions={
              canAssign
                ? [
                    {
                      key: "assign-employee",
                      label: t(
                        "vehicleRegistrationEmployees.rowActions.assign"
                      ),
                      icon: <PersonAddAltOutlinedIcon sx={{ fontSize: 16 }} />,
                      onClick: () => openAssignDialog(params.row),
                    },
                  ]
                : undefined
            }
          />
        );
      },
    };

    return [...base, actionsCol];
  }, [
    vehicleRegistrationsColumns,
    can,
    deleteRegistration.isPending,
    navigate,
    requestDelete,
    t,
    openAssignDialog,
  ]);

  const hasActions = columnsWithActions.some((c) => c.field === "actions");

  const renderDetailPanel = useCallback(
    (params: GridRowParams<VehicleRegistration>) => (
      <GridDetailPanel<VehicleRegistration>
        row={params.row}
        columns={
          vehicleRegistrationsColumns as GridColDef<VehicleRegistration>[]
        }
      />
    ),
    [vehicleRegistrationsColumns]
  );

  const getDetailPanelHeight = useCallback(
    (_params: GridRowParams<VehicleRegistration>) => 220,
    []
  );

  if (error) return <div>{t("vehicleRegistrations.list.error")}</div>;

  const getRowClassName = useCallback((params: any) => {
    const raw = (params.row as any)?.validTo;
    if (!raw) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next = new Date(raw);
    next.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((next.getTime() - today.getTime()) / 86400000);
    return diffDays >= 0 && diffDays <= 14 ? "row--dueSoon" : "";
  }, []);

  return (
    <>
      <ReusableDataGrid<VehicleRegistration>
        rows={vehicleRegistrationsRows}
        columns={columnsWithActions}
        getRowId={(r) => String((r as any).id)}
        pinnedRightField={hasActions ? "actions" : undefined}
        loading={!!isLoading}
        getDetailPanelContent={renderDetailPanel}
        getDetailPanelHeight={getDetailPanelHeight}
        detailPanelMode="mobile-only"
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowClassName={getRowClassName}
        sx={dueSoonRowSx(theme)}
      />

      <AssignVehicleRegistrationEmployeeDialog
        open={assignOpen}
        onClose={closeAssignDialog}
        referenceText={
          selectedRegistration ? `#${selectedRegistration.id}` : undefined
        }
        dueLabel={
          selectedRegistration?.validTo
            ? t("vehicleRegistrationEmployees.assign.due", {
                date: selectedRegistration.validTo,
              })
            : undefined
        }
        vehicleName={selectedVehicle?.name}
        registrationNumber={selectedVehicle?.registrationNumber ?? undefined}
        vehicleLoading={vehicleLoading}
        employeeOptions={employeeOptions}
        employeesLoading={employeesLoading}
        employeesError={employeesError}
        formLoading={formLoading}
        existingAssignment={existingAssignment}
        onExited={handleAssignExited}
        submitting={addMutation.isPending || updateMutation.isPending}
        onSubmit={(values, mode) => {
          if (!selectedRegistration) return;

          if (mode === "update" && existingAssignment) {
            updateMutation.mutate(
              {
                id: existingAssignment.id,
                employeeId: values.employeeId,
                note: values.note,
                vehicleId: existingAssignment.vehicleId,
                vehicleRegistrationId: existingAssignment.vehicleRegistrationId,
                status: existingAssignment.status,
                expiresOn: existingAssignment.expiresOn,
                completedAt: existingAssignment.completedAt,
              } as any,
              { onSuccess: closeAssignDialog }
            );
            return;
          }

          addMutation.mutate(
            {
              vehicleId: selectedRegistration.vehicleId,
              vehicleRegistrationId: selectedRegistration.id,
              employeeId: values.employeeId,
              note: values.note,
              status: 1,
              expiresOn: selectedRegistration.validTo,
            },
            { onSuccess: closeAssignDialog }
          );
        }}
      />

      <PermissionGate guard={{ permission: "Permission.Vehicles.Delete" }}>
        <ConfirmDialog
          open={confirmOpen}
          title={t("vehicleRegistrations.delete.title")}
          description={t("vehicleRegistrations.delete.description")}
          confirmText={t("vehicleRegistrations.delete.confirm")}
          cancelText={t("vehicleRegistrations.delete.cancel")}
          loading={deleteRegistration.isPending}
          disableBackdropClose
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </PermissionGate>
    </>
  );
}
