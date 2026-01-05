import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {
  CheckCircleRounded,
  ChevronRightRounded,
  ExpandMoreRounded,
  RadioButtonUncheckedRounded,
  ArrowDropDownRounded,
} from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { RowActions } from "../../../components/ui/datagrid/RowActions";

const isFinalStatus = (status?: number | null) => status === 3 || status === 4;

type Section = {
  key: string;
  title: string;
  items: VehicleRegistrationEmployee[];
};

function tagForStatus(status?: number | null) {
  if (status === 4) return { label: "Cancelled", color: "default" as const };
  if (status === 3) return { label: "Done", color: "success" as const };
  if (status === 2) return { label: "In progress", color: "warning" as const };
  return { label: "New", color: "default" as const };
}

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

  const sections = useMemo<Section[]>(() => {
    const assigned = tasks.filter((x) => x.status === 1);
    const inProgress = tasks.filter((x) => x.status === 2);
    const completed = tasks.filter((x) => x.status === 3);
    const cancelled = tasks.filter((x) => x.status === 4);

    const sortedAssigned = [...assigned].sort((a, b) => {
      const ta = a.expiresOn
        ? new Date(a.expiresOn).getTime()
        : Number.POSITIVE_INFINITY;
      const tb = b.expiresOn
        ? new Date(b.expiresOn).getTime()
        : Number.POSITIVE_INFINITY;
      return ta - tb;
    });
    const doToday = sortedAssigned.slice(0, Math.min(3, sortedAssigned.length));
    const newTasks = sortedAssigned.slice(doToday.length);

    const out: Section[] = [
      { key: "new", title: "Assigned", items: newTasks },
      { key: "today", title: "InProgress", items: doToday },
      {
        key: "progress",
        title: "Completed",
        items: inProgress,
      },
      { key: "completed", title: "Completed", items: completed },
      { key: "cancelled", title: "Cancelled", items: cancelled },
    ];

    return out.filter((s) => s.items.length > 0);
  }, [tasks]);

  const [openByKey, setOpenByKey] = useState<Record<string, boolean>>({});

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

  const gridCols = "40px 1fr 140px 200px 260px";

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Stack
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
      >
        <Typography variant="h5" fontWeight={700}>
          {t("vehicleRegistrationTasks.list.title")}
        </Typography>
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
        <Stack spacing={2} sx={{ width: "100%" }}>
          {sections.map((section) => {
            const open = openByKey[section.key] ?? true;

            return (
              <Box key={section.key} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    alignItems: "center",
                    gap: 0,
                    px: 0,
                    py: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => toggleSection(section.key)}
                    >
                      {open ? <ExpandMoreRounded /> : <ChevronRightRounded />}
                    </IconButton>
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ minWidth: 0, py: 0.75 }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        maxWidth: "100%",
                        px: 1.25,
                        py: 0.5,

                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {section.title}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.25}
                    sx={{ py: 0.75 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Deadline
                    </Typography>
                    <ArrowDropDownRounded
                      sx={{ fontSize: 18, color: "text.disabled" }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.25}
                    sx={{ py: 0.75 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Projects
                    </Typography>
                    <ArrowDropDownRounded
                      sx={{ fontSize: 18, color: "text.disabled" }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.25}
                    sx={{ py: 0.75 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Labels
                    </Typography>
                    <ArrowDropDownRounded
                      sx={{ fontSize: 18, color: "text.disabled" }}
                    />
                  </Stack>
                </Box>

                <Box
                  sx={{
                    mt: 0.75,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                  }}
                >
                  <Collapse in={open} timeout={160} unmountOnExit={false}>
                    <Stack divider={<Divider flexItem />}>
                      {section.items.map((task) => {
                        const vehicle = vehicleById.get(task.vehicleId);

                        const deadline = formatDate(task.expiresOn);

                        const projectName =
                          vehicle?.name ?? `Vehicle #${task.vehicleId}`;

                        const statusTag = tagForStatus(task.status);
                        const disabled =
                          isFinalStatus(task.status) || updateStatus.isPending;

                        const taskTitle =
                          vehicle && (vehicle.brand || vehicle.model)
                            ? `${vehicle.brand ?? ""} ${
                                vehicle.model ?? ""
                              }`.trim()
                            : `Vehicle registration task #${task.id}`;

                        const regNumber: string | null =
                          vehicle?.registrationNumber ?? null;

                        const isCompleted = task.status === 3;

                        return (
                          <Box
                            key={String(task.id)}
                            sx={{
                              display: "grid",
                              gridTemplateColumns: gridCols,
                              alignItems: "center",
                              px: 0,
                              py: 0,
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Checkbox
                                checked={task.status === 3}
                                onChange={() => handleOpenStatusDialog(task)}
                                disabled={updateStatus.isPending}
                                icon={<RadioButtonUncheckedRounded />}
                                checkedIcon={<CheckCircleRounded />}
                                sx={{ p: 0.5 }}
                              />
                            </Box>

                            <Box sx={{ py: 0.9, pr: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                              >
                                {taskTitle}
                              </Typography>
                              {task.note?.trim() || vehicle?.vin ? (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                >
                                  {task.note?.trim()
                                    ? task.note.trim()
                                    : `VIN: ${vehicle?.vin}`}
                                </Typography>
                              ) : null}
                            </Box>

                            <Box sx={{ py: 0.9, pr: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {deadline || "-"}
                              </Typography>
                            </Box>

                            <Box sx={{ py: 0.9, pr: 1, minWidth: 0 }}>
                              <Chip
                                size="small"
                                label={projectName}
                                variant="outlined"
                                sx={{ height: 24, maxWidth: "100%" }}
                              />
                            </Box>

                            <Box
                              sx={{
                                py: 0.9,
                                pr: 1,
                                minWidth: 0,
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                gap: 1,
                              }}
                            >
                              {/* LEFT SIDE: chips */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ minWidth: 0, overflow: "hidden" }}
                              >
                                <Chip
                                  size="small"
                                  label={statusTag.label}
                                  color={statusTag.color}
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />

                                {regNumber ? (
                                  <Chip
                                    size="small"
                                    label={regNumber}
                                    variant="outlined"
                                    sx={{ height: 24 }}
                                  />
                                ) : null}
                              </Stack>

                              {/* RIGHT SIDE: action stuck to far right */}
                              {!isCompleted ? (
                                <Box sx={{ ml: "auto", flexShrink: 0 }}>
                                  <RowActions
                                    disabled={disabled}
                                    onChangeStatus={() =>
                                      handleOpenStatusDialog(task)
                                    }
                                    labels={{
                                      status: t(
                                        "vehicleRegistrationTasks.actions.changeStatus"
                                      ),
                                    }}
                                    buttonProps={{ size: "small" }}
                                  />
                                </Box>
                              ) : null}
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Collapse>
                </Box>
              </Box>
            );
          })}
        </Stack>
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
