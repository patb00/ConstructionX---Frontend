import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  TaskAltOutlined,
  DescriptionOutlined,
  EventOutlined,
  LabelOutlined,
} from "@mui/icons-material";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";

import type { VehicleRegistrationEmployee } from "..";
import React from "react";
import ResolveVehicleRegistrationTaskDialog from "../components/ResolveVehicleRegistrationTaskDialog";

import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useVehicleRegistrationEmployeesByEmployee } from "../hooks/useVehicleRegistrationEmployeesByEmployee";
import { useUpdateVehicleRegistrationEmployee } from "../hooks/useUpdateVehicleRegistrationEmployee";
import { useVehicles } from "../../vehicles/hooks/useVehicles";

import ListView, {
  type ListViewColumn,
  type ListViewSection,
  type ListViewStatusTag,
  listViewBodyCellSx,
  listViewChipSx,
  listViewColDividerSx,
} from "../../../components/ui/views/ListView";
import HeaderLabel from "../../../components/ui/HeaderLabel";
import { isFinalStatus, tagForStatus } from "../utils/taskStatus";

type TaskView = {
  task: VehicleRegistrationEmployee;
  title: string;
  subtitle: string | null;
  deadline: string;
  projectName: string;
  regNumber: string | null;
  statusTag: ListViewStatusTag;
  disabled: boolean;
  isCompleted: boolean;
};

const VehicleRegistrationTasksPage = () => {
  const { t } = useTranslation();
  const { userId, role } = useAuthStore();
  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const { vehiclesRows = [] } = useVehicles();
  const [tab, setTab] = useState(0);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, value: number) => setTab(value),
    []
  );

  const a11yProps = (index: number) => ({
    id: `my-tasks-tab-${index}`,
    "aria-controls": `my-tasks-tabpanel-${index}`,
  });

  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  const shouldShowNone =
    !employeesLoading && role !== "Admin" && myEmployeeId == null;

  const queryEmployeeId = Number.isFinite(myEmployeeId ?? NaN)
    ? Number(myEmployeeId)
    : 0;

  const { data: tasks = [], isLoading } =
    useVehicleRegistrationEmployeesByEmployee(queryEmployeeId);

  const updateStatus = useUpdateVehicleRegistrationEmployee();

  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [activeTask, setActiveTask] =
    useState<VehicleRegistrationEmployee | null>(null);

  const handleOpenResolveDialog = useCallback(
    (task: VehicleRegistrationEmployee) => {
      setActiveTask(task);
      setResolveDialogOpen(true);
    },
    []
  );

  const handleCloseResolveDialog = useCallback(() => {
    setResolveDialogOpen(false);
    setActiveTask(null);
  }, []);

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

  const sections = useMemo<Array<ListViewSection<TaskView>>>(() => {
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

    const out: Array<ListViewSection<TaskView>> = [
      {
        key: "assigned",
        title: t("vehicleRegistrationTasks.list.sections.assigned"),
        items: remaining,
      },
      {
        key: "due-soon",
        title: t("vehicleRegistrationTasks.list.sections.dueSoon"),
        items: dueSoon,
      },
      {
        key: "in-progress",
        title: t("vehicleRegistrationTasks.list.sections.inProgress"),
        items: inProgress,
      },
      {
        key: "completed",
        title: t("vehicleRegistrationTasks.list.sections.completed"),
        items: completed,
      },
      {
        key: "cancelled",
        title: t("vehicleRegistrationTasks.list.sections.cancelled"),
        items: cancelled,
      },
    ];

    return out.filter((s) => s.items.length > 0);
  }, [t, taskViews]);

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

  const columns = useMemo<Array<ListViewColumn<TaskView>>>(() => {
    return [
      {
        key: "done",
        width: 44,
        padding: "none",
        align: "center",
        header: (
          <Checkbox
            size="small"
            disabled
            sx={{
              p: 0,
              "&.Mui-disabled": { opacity: 1, color: "text.secondary" },
            }}
          />
        ),
        headSx: [listViewColDividerSx, { px: 0.5, py: 0, textAlign: "center" }],
        cellSx: [
          listViewBodyCellSx,
          listViewColDividerSx,
          { px: 0.5, py: 0, textAlign: "center" },
        ],
        render: (item) => (
          <Checkbox
            checked={item.task.status === 3}
            disabled
            icon={<CheckBoxOutlineBlankRounded />}
            checkedIcon={<CheckBoxRounded />}
            sx={{
              p: 0,
              "&.Mui-disabled": { opacity: 1 },
              color: item.task.status === 3 ? "primary.main" : "text.secondary",
              "&.Mui-disabled.Mui-checked": { color: "primary.main" },
            }}
          />
        ),
      },

      {
        key: "taskName",
        width: 280,
        header: (
          <HeaderLabel
            icon={<TaskAltOutlined />}
            text={t("vehicleRegistrationTasks.columns.taskName")}
          />
        ),
        headSx: [listViewColDividerSx],
        cellSx: [listViewBodyCellSx, listViewColDividerSx],
        render: (item) => (
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {item.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ display: { xs: "block", md: "none" }, fontSize: 12 }}
            >
              {item.subtitle || "-"}
            </Typography>
          </Stack>
        ),
      },

      {
        key: "description",
        width: "28%",
        hideBelow: "lg",
        header: (
          <HeaderLabel
            icon={<DescriptionOutlined />}
            text={t("vehicleRegistrationTasks.columns.description")}
          />
        ),
        headSx: [listViewColDividerSx],
        cellSx: [listViewBodyCellSx, listViewColDividerSx],
        render: (item) => (
          <Typography variant="body2" color="text.secondary" noWrap>
            {item.subtitle || "-"}
          </Typography>
        ),
      },

      {
        key: "deadline",
        width: 210,
        hideBelow: "lg",
        header: (
          <HeaderLabel
            icon={<EventOutlined />}
            text={t("vehicleRegistrationTasks.columns.deadline")}
          />
        ),
        headSx: [listViewColDividerSx],
        cellSx: [listViewBodyCellSx, listViewColDividerSx],
        render: (item) => (
          <Typography variant="body2" color="text.secondary" noWrap>
            {item.deadline || "-"}
          </Typography>
        ),
      },

      {
        key: "type",
        width: 160,
        hideBelow: "lg",
        header: (
          <HeaderLabel
            icon={<LabelOutlined />}
            text={t("vehicleRegistrationTasks.columns.type")}
          />
        ),
        headSx: [listViewColDividerSx],
        cellSx: [listViewBodyCellSx, listViewColDividerSx],
        render: (item) => (
          <Chip size="small" label={item.projectName} sx={listViewChipSx} />
        ),
      },

      {
        key: "actions",
        width: 180,
        header: (
          <HeaderLabel
            icon={<CheckCircleOutlineOutlined />}
            text={t("vehicleRegistrationTasks.columns.actions", {
              defaultValue: "Actions",
            })}
          />
        ),
        cellSx: [listViewBodyCellSx],
        render: (item) => (
          <Button
            size="small"
            variant="outlined"
            startIcon={<CheckCircleOutlineOutlined />}
            onClick={() => handleOpenResolveDialog(item.task)}
            disabled={item.disabled}
            sx={{
              height: 28,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1,
              opacity: item.disabled ? 0.6 : 1,
            }}
          >
            {t("vehicleRegistrationTasks.actions.completeTask")}
          </Button>
        ),
      },
    ];
  }, [handleOpenResolveDialog, t, updateStatus.isPending]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {t("myTasks.title")}
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mt: 1 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={t("myTasks.tabs.vehicleRegistration")}
            {...a11yProps(0)}
          />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box
          role="tabpanel"
          id="my-tasks-tabpanel-0"
          aria-labelledby="my-tasks-tab-0"
          sx={{ pt: 2 }}
        >
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
            <ListView<TaskView>
              sections={sections}
              openByKey={openByKey}
              onToggleSection={toggleSection}
              getRowKey={(row) => String(row.task.id)}
              columns={columns}
              loading={isLoading}
              loadingText={t("common.loading", { defaultValue: "Loading..." })}
            />
          )}
        </Box>
      )}

      <ResolveVehicleRegistrationTaskDialog
        open={resolveDialogOpen}
        onClose={handleCloseResolveDialog}
        onSuccess={handleCloseResolveDialog}
        task={activeTask}
      />
    </Stack>
  );
};

export default VehicleRegistrationTasksPage;
