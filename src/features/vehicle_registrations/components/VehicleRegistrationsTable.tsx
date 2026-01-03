import { useMemo, useState, useCallback, useEffect } from "react";
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
import { AssignTaskDialog } from "../../../components/ui/assign-dialog/AssignTaskDialog";
import { useAddVehicleRegistrationEmployee } from "../../vehicle_registration_employee/hooks/useAddVehicleRegistrationEmployee";
import { useVehicleRegistrationEmployeesByVehicle } from "../../vehicle_registration_employee/hooks/useVehicleRegistrationEmployeesByVehicle";
import { useUpdateVehicleRegistrationEmployee } from "../../vehicle_registration_employee/hooks/useUpdateVehicleRegistrationEmployee";
import { useVehicle } from "../../vehicles/hooks/useVehicle";
import { dueSoonRowSx } from "../../../components/ui/datagrid/styles/dueSoonRowSx";

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

  const [assignValues, setAssignValues] = useState({
    employeeId: "" as number | "",
    note: "",
  });

  const [isEditingAssignment, setIsEditingAssignment] = useState(false);

  const {
    data: selectedRegistration,
    isLoading: selectedRegistrationLoading,
    isError: selectedRegistrationError,
  } = useVehicleRegistration(selectedRegistrationId ?? 0);

  const {
    data: registrationsByVehicle,
    isFetched: registrationsByVehicleFetched,
  } = useVehicleRegistrationEmployeesByVehicle(selectedVehicleId ?? 0);

  const { data: selectedVehicle, isLoading: vehicleLoading } = useVehicle(
    selectedVehicleId ?? 0
  );

  const existingAssignment = registrationsByVehicle?.[0];
  const hasExistingAssignment = (registrationsByVehicle?.length ?? 0) > 0;

  const formLoading =
    assignOpen && !!selectedVehicleId && !registrationsByVehicleFetched;

  const formDisabled =
    formLoading || (hasExistingAssignment && !isEditingAssignment);

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
    setAssignValues({ employeeId: "", note: "" });
    setIsEditingAssignment(false);
    setSelectedRegistrationId(row.id);
    setSelectedVehicleId(row.vehicleId);
    setAssignOpen(true);
  }, []);

  const closeAssignDialog = useCallback(() => {
    setAssignOpen(false);
    setSelectedRegistrationId(null);
    setSelectedVehicleId(null);
    setIsEditingAssignment(false);
    setAssignValues({ employeeId: "", note: "" });
  }, []);

  const handleAssignSubmit = useCallback(() => {
    if (!selectedRegistration || assignValues.employeeId === "") return;

    if (hasExistingAssignment && existingAssignment) {
      updateMutation.mutate(
        {
          id: existingAssignment.id,
          employeeId: assignValues.employeeId as number,
          note: assignValues.note,
          vehicleId: existingAssignment.vehicleId,
          vehicleRegistrationId: existingAssignment.vehicleRegistrationId,
          status: existingAssignment.status,
          expiresOn: existingAssignment.expiresOn,
          completedAt: existingAssignment.completedAt,
        } as any,
        {
          onSuccess: () => {
            closeAssignDialog();
          },
        }
      );

      return;
    }

    addMutation.mutate({
      vehicleId: selectedRegistration.vehicleId,
      vehicleRegistrationId: selectedRegistration.id,
      employeeId: assignValues.employeeId,
      note: assignValues.note,
      status: 1,
      expiresOn: selectedRegistration.validTo,
    });
  }, [
    selectedRegistration,
    assignValues,
    hasExistingAssignment,
    existingAssignment,
    addMutation,
    updateMutation,
  ]);

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

  /*   const dueSoonRowSx = {
    "& .MuiDataGrid-row.row--dueSoon": {
      backgroundColor: `${alpha(theme.palette.error.main, 0.12)} !important`,
    },
    "& .MuiDataGrid-row.row--dueSoon .MuiDataGrid-cell": {
      backgroundColor: `${alpha(theme.palette.error.main, 0.12)} !important`,
    },
    "& .MuiDataGrid-row.row--dueSoon .MuiDataGrid-cell--pinnedRight": {
      backgroundColor: `white !important`,
    },
  }; */

  useEffect(() => {
    if (!assignOpen) return;
    if (!existingAssignment) return;
    if (isEditingAssignment) return;

    setAssignValues({
      employeeId: existingAssignment.employeeId ?? "",
      note: existingAssignment.note ?? "",
    });
  }, [assignOpen, existingAssignment, isEditingAssignment]);

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

      <AssignTaskDialog
        formDisabled={formDisabled}
        open={assignOpen}
        onClose={closeAssignDialog}
        title={
          hasExistingAssignment
            ? t("vehicleRegistrationEmployees.assign.alreadyAssignedTitle")
            : t("vehicleRegistrationEmployees.assign.title")
        }
        subtitle={t("vehicleRegistrationEmployees.assign.subtitle")}
        referenceText={
          selectedRegistration ? `#${selectedRegistration.id}` : undefined
        }
        previewTitle={t("vehicleRegistrationEmployees.assign.previewTitle")}
        previewSubtitle={t(
          "vehicleRegistrationEmployees.assign.previewSubtitle"
        )}
        dueLabel={
          selectedRegistration?.validTo
            ? t("vehicleRegistrationEmployees.assign.due", {
                date: selectedRegistration.validTo,
              })
            : undefined
        }
        previewFields={[
          {
            label: t("vehicleRegistrationEmployees.assign.fields.vehicle"),
            value: selectedVehicle
              ? selectedVehicle.name
              : vehicleLoading
              ? t("")
              : "-",
          },
          {
            label: t("vehicleRegistrationEmployees.assign.fields.registration"),
            value: selectedVehicle
              ? selectedVehicle.registrationNumber
              : vehicleLoading
              ? t("")
              : "-",
          },
        ]}
        employeeLabel={t("vehicleRegistrationEmployees.assign.employee")}
        employeeOptions={employeeOptions}
        values={assignValues}
        onChange={setAssignValues}
        noteLabel={t("vehicleRegistrationEmployees.assign.note")}
        helperText={
          hasExistingAssignment
            ? t("vehicleRegistrationEmployees.assign.alreadyAssignedHelper")
            : t("vehicleRegistrationEmployees.assign.helper")
        }
        cancelText={t("common.cancel")}
        formLoading={formLoading}
        showEdit={hasExistingAssignment}
        isEditing={isEditingAssignment}
        onEdit={() => setIsEditingAssignment(true)}
        submitting={addMutation.isPending || updateMutation.isPending}
        submitText={
          hasExistingAssignment
            ? isEditingAssignment
              ? t("common.submit")
              : t("vehicleRegistrationEmployees.assign.alreadyAssignedSubmit")
            : t("common.submit")
        }
        submitDisabled={
          formLoading ||
          (!isEditingAssignment && hasExistingAssignment) ||
          assignValues.employeeId === "" ||
          employeesLoading ||
          employeesError ||
          selectedRegistrationLoading ||
          selectedRegistrationError ||
          !selectedRegistration
        }
        onSubmit={handleAssignSubmit}
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
