import {
  Box,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  UpdateVehicleRegistrationEmployeeRequest,
  VehicleRegistrationEmployee,
} from "..";
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

  const queryEmployeeId =
    !shouldShowNone && Number.isFinite(effectiveEmployeeId ?? NaN)
      ? Number(effectiveEmployeeId)
      : 0;

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useVehicleRegistrationEmployeesByEmployee(queryEmployeeId);

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

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h5" fontWeight={600}>
        {t("vehicleRegistrationTasks.title")}
      </Typography>

      {shouldShowNone ? (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.empty")}
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
      ) : isError ? (
        <Typography variant="body2" color="error">
          {t("vehicleRegistrationTasks.error")}
        </Typography>
      ) : tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.empty")}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {tasks.map((task) => {
            const titleValue = task.vehicleRegistrationId || task.vehicleId;
            const statusLabel =
              statusLabelByValue.get(task.status) ??
              t("vehicleRegistrationTasks.status.assigned");

            return (
              <Card
                key={task.id}
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {titleValue}
                  </Typography>
                  {task.expiresOn ? (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.expiresOn}
                    </Typography>
                  ) : null}
                  {task.note ? (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.note}
                    </Typography>
                  ) : null}
                </Stack>

                <Chip
                  size="small"
                  label={statusLabel}
                  sx={{ textTransform: "none" }}
                />

                <IconButton
                  size="small"
                  color="primary"
                  disabled={isFinalStatus(task.status) || updateStatus.isPending}
                  onClick={() => handleOpenStatusDialog(task)}
                  aria-label={t("vehicleRegistrationTasks.actions.changeStatus")}
                >
                  <SyncIcon fontSize="small" />
                </IconButton>
              </Card>
            );
          })}
        </Stack>
      )}

      <ChangeStatusDialog
        open={statusDialogOpen}
        title={t("vehicleRegistrationTasks.actions.changeStatus")}
        currentStatus={activeTask?.status ?? null}
        options={statusOptions}
        loading={updateStatus.isPending}
        onClose={handleCloseStatusDialog}
        onSave={handleSaveStatus}
        saveLabel={t("vehicleRegistrationTasks.actions.save")}
        cancelLabel={t("vehicleRegistrationTasks.actions.cancel")}
        disableBackdropClose
      />
    </Stack>
  );
};

export default MyVehicleRegistrationTasksPage;
