import {
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  CalendarMonthRounded,
  ViewKanbanRounded,
  ViewListRounded,
} from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
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
import { useVehicles } from "../../vehicles/hooks/useVehicles";
import CalendarView from "./views/CalendarView";
import KanbanView from "./views/KanbanView";
import ListView from "./views/ListView";
import type {
  CalendarDay,
  KanbanColumn,
  TaskSection,
  TaskView,
} from "./views/types";

const isFinalStatus = (status?: number | null) => status === 3 || status === 4;

function tagForStatus(status?: number | null) {
  if (status === 4) return { label: "Cancelled", color: "default" as const };
  if (status === 3) return { label: "Done", color: "success" as const };
  if (status === 2) return { label: "In progress", color: "warning" as const };
  return { label: "New", color: "default" as const };
}

type ViewMode = "list" | "kanban" | "calendar";

const toStartOfDay = (value: Date) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const MyVehicleRegistrationTasksPage = () => {
  const { t } = useTranslation();
  const { userId, role } = useAuthStore();
  const { employeeRows = [] } = useEmployees();
  const { vehiclesRows = [] } = useVehicles();

  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  const shouldShowNone = role !== "Admin" && myEmployeeId == null;

  const queryEmployeeId = Number.isFinite(myEmployeeId ?? NaN)
    ? Number(myEmployeeId)
    : 0;

  const { data: tasks = [], isLoading } =
    useVehicleRegistrationEmployeesByEmployee(queryEmployeeId);

  const statusOptions = useMemo<StatusOption[]>(
    () => [
      { value: 1, label: t("vehicleRegistrationTasks.status.assigned") },
      { value: 2, label: t("vehicleRegistrationTasks.status.inProgress") },
      { value: 3, label: t("vehicleRegistrationTasks.status.completed") },
      { value: 4, label: t("vehicleRegistrationTasks.status.cancelled") },
    ],
    [t]
  );

  const updateStatus = useUpdateVehicleRegistrationEmployee();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [activeTask, setActiveTask] =
    useState<VehicleRegistrationEmployee | null>(null);

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

  const vehicleById = useMemo(() => {
    const m = new Map<number, any>();
    (vehiclesRows ?? []).forEach((v: any) => m.set(v.id, v));
    return m;
  }, [vehiclesRows]);

  const formatDate = useCallback((value?: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  }, []);

  const taskViews = useMemo<TaskView[]>(() => {
    return tasks.map((task) => {
      const vehicle = vehicleById.get(task.vehicleId);
      const deadline = formatDate(task.expiresOn);
      const projectName = vehicle?.name ?? `Vehicle #${task.vehicleId}`;

      const title =
        vehicle && (vehicle.brand || vehicle.model)
          ? `${vehicle.brand ?? ""} ${vehicle.model ?? ""}`.trim()
          : `Vehicle registration task #${task.id}`;

      const subtitle = task.note?.trim()
        ? task.note.trim()
        : vehicle?.vin
          ? `VIN: ${vehicle?.vin}`
          : null;

      const statusTag = tagForStatus(task.status);
      const disabled = isFinalStatus(task.status) || updateStatus.isPending;
      const regNumber: string | null = vehicle?.registrationNumber ?? null;

      return {
        task,
        title,
        subtitle,
        deadline,
        projectName,
        regNumber,
        statusTag,
        disabled,
        isCompleted: task.status === 3,
      };
    });
  }, [formatDate, tasks, updateStatus.isPending, vehicleById]);

  const sections = useMemo<TaskSection[]>(() => {
    const assigned = taskViews.filter((x) => x.task.status === 1);
    const inProgress = taskViews.filter((x) => x.task.status === 2);
    const completed = taskViews.filter((x) => x.task.status === 3);
    const cancelled = taskViews.filter((x) => x.task.status === 4);

    const sortedAssigned = [...assigned].sort((a, b) => {
      const ta = a.task.expiresOn
        ? new Date(a.task.expiresOn).getTime()
        : Number.POSITIVE_INFINITY;
      const tb = b.task.expiresOn
        ? new Date(b.task.expiresOn).getTime()
        : Number.POSITIVE_INFINITY;
      return ta - tb;
    });
    const dueSoon = sortedAssigned.slice(0, Math.min(3, sortedAssigned.length));
    const remaining = sortedAssigned.slice(dueSoon.length);

    const out: TaskSection[] = [
      { key: "assigned", title: "Assigned", items: remaining },
      { key: "due-soon", title: "Due soon", items: dueSoon },
      { key: "in-progress", title: "In progress", items: inProgress },
      { key: "completed", title: "Completed", items: completed },
      { key: "cancelled", title: "Cancelled", items: cancelled },
    ];

    return out.filter((s) => s.items.length > 0);
  }, [taskViews]);

  const [openByKey, setOpenByKey] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<ViewMode>("list");

  useEffect(() => {
    setOpenByKey((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const s of sections) {
        if (next[s.key] === undefined) {
          next[s.key] = true;
          changed = true;
        }
      }

      for (const key of Object.keys(next)) {
        if (!sections.some((s) => s.key === key)) {
          delete next[key];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [sections]);

  const toggleSection = useCallback((key: string) => {
    setOpenByKey((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));
  }, []);

  const kanbanColumns = useMemo<KanbanColumn[]>(() => {
    return [
      {
        key: "assigned",
        title: "Assigned",
        items: taskViews.filter((item) => item.task.status === 1),
      },
      {
        key: "in-progress",
        title: "In progress",
        items: taskViews.filter((item) => item.task.status === 2),
      },
      {
        key: "completed",
        title: "Completed",
        items: taskViews.filter((item) => item.task.status === 3),
      },
      {
        key: "cancelled",
        title: "Cancelled",
        items: taskViews.filter((item) => item.task.status === 4),
      },
    ];
  }, [taskViews]);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const today = toStartOfDay(new Date());
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const label = date.toLocaleDateString(undefined, { weekday: "short" });
      const dateLabel = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const tasksForDay = taskViews.filter((item) => {
        if (!item.task.expiresOn) return false;
        const deadline = toStartOfDay(new Date(item.task.expiresOn));
        return isSameDay(deadline, date);
      });

      return {
        key: `${date.toISOString()}`,
        label,
        dateLabel,
        tasks: tasksForDay,
      };
    });
  }, [taskViews]);

  const unscheduledTasks = useMemo(
    () => taskViews.filter((item) => !item.task.expiresOn),
    [taskViews]
  );

  const handleViewChange = useCallback(
    (_: MouseEvent<HTMLElement>, value: ViewMode | null) => {
      if (value) setActiveView(value);
    },
    []
  );

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Typography variant="h5" fontWeight={700}>
          {t("vehicleRegistrationTasks.list.title")}
        </Typography>

        <ToggleButtonGroup
          value={activeView}
          exclusive
          onChange={handleViewChange}
          size="small"
          sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}
        >
          <ToggleButton value="list">
            <ViewListRounded sx={{ mr: 0.75 }} />
            List view
          </ToggleButton>
          <ToggleButton value="kanban">
            <ViewKanbanRounded sx={{ mr: 0.75 }} />
            Kanban view
          </ToggleButton>
          <ToggleButton value="calendar">
            <CalendarMonthRounded sx={{ mr: 0.75 }} />
            Calendar view
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {shouldShowNone ? (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.list.empty")}
        </Typography>
      ) : isLoading ? (
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : sections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("vehicleRegistrationTasks.list.empty")}
        </Typography>
      ) : (
        <>
          {activeView === "list" ? (
            <ListView
              sections={sections}
              openByKey={openByKey}
              onToggleSection={toggleSection}
              onChangeStatus={handleOpenStatusDialog}
              isUpdating={updateStatus.isPending}
              labels={{
                deadline: "Deadline",
                projects: "Projects",
                labels: "Labels",
                changeStatus: t("vehicleRegistrationTasks.actions.changeStatus"),
              }}
            />
          ) : null}

          {activeView === "kanban" ? (
            <KanbanView
              columns={kanbanColumns}
              onChangeStatus={handleOpenStatusDialog}
              isUpdating={updateStatus.isPending}
              changeStatusLabel={t(
                "vehicleRegistrationTasks.actions.changeStatus"
              )}
            />
          ) : null}

          {activeView === "calendar" ? (
            <CalendarView
              days={calendarDays}
              unscheduledTasks={unscheduledTasks}
              onChangeStatus={handleOpenStatusDialog}
              isUpdating={updateStatus.isPending}
              changeStatusLabel={t(
                "vehicleRegistrationTasks.actions.changeStatus"
              )}
            />
          ) : null}
        </>
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
