import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid-pro";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type {
  UpdateVehicleRegistrationEmployeeRequest,
  VehicleRegistrationEmployee,
} from "..";
import ReusableDataGrid from "../../../components/ui/datagrid/ReusableDataGrid";
import {
  ChangeStatusDialog,
  type StatusOption,
} from "../../../components/ui/change-status-dialog/ChangeStatusDialog";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useVehicleRegistrationEmployeesByEmployee } from "../hooks/useVehicleRegistrationEmployeesByEmployee";
import { useUpdateVehicleRegistrationEmployee } from "../hooks/useUpdateVehicleRegistrationEmployee";

const isFinalStatus = (status?: number | null) => status === 3 || status === 4;

const MyVehicleRegistrationTasksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, role } = useAuthStore();
  const { employeeRows = [] } = useEmployees();

  /**
   * IMPORTANT:
   * JWT userId is a UUID string (e.g. "a9b50b3b-...").
   * Tasks are keyed by numeric employeeId.
   * The bridge is employee.applicationUserId === JWT userId.
   */
  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  const effectiveEmployeeId: number | null =
    role === "Admin" ? myEmployeeId : myEmployeeId;

  const shouldShowNone = role !== "Admin" && myEmployeeId == null;

  const queryEmployeeId = Number.isFinite(effectiveEmployeeId ?? NaN)
    ? Number(effectiveEmployeeId)
    : 0;

  const { data: tasks = [], isLoading } =
    useVehicleRegistrationEmployeesByEmployee(queryEmployeeId);

  const statusOptions = useMemo<StatusOption[]>(
    () => [
      {
        value: 1,
        label: t("vehicleRegistrationTasks.status.assigned"),
      },
      {
        value: 2,
        label: t("vehicleRegistrationTasks.status.inProgress"),
      },
      {
        value: 3,
        label: t("vehicleRegistrationTasks.status.completed"),
      },
      {
        value: 4,
        label: t("vehicleRegistrationTasks.status.cancelled"),
      },
    ],
    [t]
  );

  const statusLabelByValue = useMemo(
    () => new Map(statusOptions.map((opt) => [opt.value, opt.label])),
    [statusOptions]
  );

  const updateStatus = useUpdateVehicleRegistrationEmployee();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<VehicleRegistrationEmployee | null>(
    null
  );

  const handleOpenStatusDialog = useCallback(
    (task: VehicleRegistrationEmployee) => {
      setActiveTask(task);
      setStatusDialogOpen(true);
    },
    []
  );

  const handleCloseStatusDialog = useCallback(() => {
    if (updateStatus.isPending) return;
    setStatusDialogOpen(false);
  }, [updateStatus.isPending]);

  const handleSaveStatus = useCallback(
    async (status: number) => {
      if (!activeTask) return;

      const payload: UpdateVehicleRegistrationEmployeeRequest = {
        id: activeTask.id,
        vehicleId: activeTask.vehicleId,
        employeeId: activeTask.employeeId,
        expiresOn: activeTask.expiresOn,
        vehicleRegistrationId: activeTask.vehicleRegistrationId,
        status,
        note: activeTask.note ?? null,
        completedAt: activeTask.completedAt ?? null,
      };

      await updateStatus.mutateAsync(payload);
      setStatusDialogOpen(false);
    },
    [activeTask, updateStatus]
  );

  const columns = useMemo<GridColDef<VehicleRegistrationEmployee>[]>(
    () => [
      {
        field: "id",
        headerName: t("vehicleRegistrationTasks.list.columns.id"),
        minWidth: 80,
        flex: 0.2,
      },
      {
        field: "vehicleId",
        headerName: t("vehicleRegistrationTasks.list.columns.vehicleId"),
        minWidth: 140,
        flex: 0.3,
      },
      {
        field: "status",
        headerName: t("vehicleRegistrationTasks.list.columns.status"),
        minWidth: 160,
        flex: 0.3,
        valueFormatter: (params) =>
          statusLabelByValue.get(params.value as number) ??
          t("vehicleRegistrationTasks.status.unknown"),
      },
      {
        field: "actions",
        headerName: t("vehicleRegistrationTasks.list.columns.actions"),
        minWidth: 200,
        flex: 0.4,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => {
          const isDisabled = isFinalStatus(row.status) || updateStatus.isPending;

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                variant="text"
                onClick={() =>
                  navigate(`/app/my-vehicle-registration-tasks/${row.id}`)
                }
              >
                {t("vehicleRegistrationTasks.actions.view")}
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={isDisabled}
                onClick={() => handleOpenStatusDialog(row)}
              >
                {t("vehicleRegistrationTasks.actions.changeStatus")}
              </Button>
            </Stack>
          );
        },
      },
    ],
    [
      navigate,
      statusLabelByValue,
      t,
      updateStatus.isPending,
      handleOpenStatusDialog,
    ]
  );

  const hasActions = useMemo(
    () => columns.some((column) => column.field === "actions"),
    [columns]
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h5" fontWeight={600}>
        {t("vehicleRegistrationTasks.list.title")}
      </Typography>

      {shouldShowNone ? (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.list.empty")}
        </Typography>
      ) : isLoading ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.list.empty")}
        </Typography>
      ) : (
        <Box sx={{ flex: 1, minHeight: 320 }}>
          <ReusableDataGrid<VehicleRegistrationEmployee>
            rows={tasks}
            columns={columns}
            getRowId={(row) => String(row.id)}
            pinnedRightField={hasActions ? "actions" : undefined}
          />
        </Box>
      )}

      <ChangeStatusDialog
        open={statusDialogOpen}
        title={t("vehicleRegistrationTasks.dialog.title")}
        currentStatus={activeTask?.status ?? null}
        options={statusOptions}
        loading={updateStatus.isPending}
        onClose={handleCloseStatusDialog}
        onSave={handleSaveStatus}
        saveLabel={t("vehicleRegistrationTasks.dialog.save")}
        cancelLabel={t("vehicleRegistrationTasks.dialog.cancel")}
        disableBackdropClose
      />
    </Stack>
  );
};

export default MyVehicleRegistrationTasksPage;
