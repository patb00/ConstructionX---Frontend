import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import type { UpdateVehicleRegistrationEmployeeRequest } from "..";
import {
  ChangeStatusDialog,
  type StatusOption,
} from "../../../components/ui/change-status-dialog/ChangeStatusDialog";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useVehicleRegistrationEmployee } from "../hooks/useVehicleRegistrationEmployee";
import { useUpdateVehicleRegistrationEmployee } from "../hooks/useUpdateVehicleRegistrationEmployee";

const isFinalStatus = (status?: number | null) => status === 3 || status === 4;

const MyVehicleRegistrationTaskDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const numericTaskId = Number(taskId);

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

  const shouldShowNone = role !== "Admin" && myEmployeeId == null;

  const queryTaskId =
    myEmployeeId != null && Number.isFinite(numericTaskId) ? numericTaskId : 0;
  const { data: task, isLoading } = useVehicleRegistrationEmployee(queryTaskId);

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

  const statusLabel = useMemo(() => {
    if (!task) return t("vehicleRegistrationTasks.status.unknown");
    return (
      statusLabelByValue.get(task.status) ??
      t("vehicleRegistrationTasks.status.unknown")
    );
  }, [statusLabelByValue, t, task]);

  const isAuthorizedTask = useMemo(() => {
    if (!task || myEmployeeId == null) return false;
    return task.employeeId === myEmployeeId;
  }, [task, myEmployeeId]);

  const updateStatus = useUpdateVehicleRegistrationEmployee();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const handleOpenStatusDialog = () => {
    if (isFinalStatus(task?.status)) return;
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    if (updateStatus.isPending) return;
    setStatusDialogOpen(false);
  };

  const handleSaveStatus = async (status: number) => {
    if (!task) return;

    const payload: UpdateVehicleRegistrationEmployeeRequest = {
      id: task.id,
      vehicleId: task.vehicleId,
      employeeId: task.employeeId,
      expiresOn: task.expiresOn,
      vehicleRegistrationId: task.vehicleRegistrationId,
      status,
      note: task.note ?? null,
      completedAt: task.completedAt ?? null,
    };

    await updateStatus.mutateAsync(payload);
    setStatusDialogOpen(false);
  };

  const isInvalidId = !Number.isFinite(numericTaskId) || numericTaskId <= 0;

  const renderBody = () => {
    if (shouldShowNone) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.list.empty")}
        </Typography>
      );
    }

    if (isInvalidId) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.detail.invalidId")}
        </Typography>
      );
    }

    if (isLoading) {
      return (
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
      );
    }

    if (!task || !isAuthorizedTask) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.detail.empty")}
        </Typography>
      );
    }

    return (
      <Stack spacing={2}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.id")}
            </Typography>
            <Typography variant="body2">{task.id}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.vehicleId")}
            </Typography>
            <Typography variant="body2">{task.vehicleId}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.employeeId")}
            </Typography>
            <Typography variant="body2">{task.employeeId}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.vehicleRegistrationId")}
            </Typography>
            <Typography variant="body2">{task.vehicleRegistrationId}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.expiresOn")}
            </Typography>
            <Typography variant="body2">{task.expiresOn ?? "—"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.completedAt")}
            </Typography>
            <Typography variant="body2">{task.completedAt ?? "—"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.status")}
            </Typography>
            <Typography variant="body2">{statusLabel}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("vehicleRegistrationTasks.detail.fields.note")}
            </Typography>
            <Typography variant="body2">{task.note ?? "—"}</Typography>
          </Box>
        </Box>
      </Stack>
    );
  };

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("vehicleRegistrationTasks.detail.title")}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/app/my-vehicle-registration-tasks")}
            sx={{ color: "primary.main" }}
          >
            {t("vehicleRegistrationTasks.detail.back")}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleOpenStatusDialog}
            disabled={
              isFinalStatus(task?.status) ||
              updateStatus.isPending ||
              !task ||
              !isAuthorizedTask
            }
          >
            {t("vehicleRegistrationTasks.actions.changeStatus")}
          </Button>
        </Stack>
      </Stack>

      {renderBody()}

      <ChangeStatusDialog
        open={statusDialogOpen}
        title={t("vehicleRegistrationTasks.dialog.title")}
        currentStatus={task?.status ?? null}
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

export default MyVehicleRegistrationTaskDetailsPage;
