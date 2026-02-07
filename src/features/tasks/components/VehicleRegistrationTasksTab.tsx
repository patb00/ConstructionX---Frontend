import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  TextField,
  Autocomplete,
  Stack,
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
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";

import ListView, {
  type ListViewColumn,
  type ListViewSection,
  type ListViewStatusTag,
  listViewBodyCellSx,
  listViewChipSx,
  listViewColDividerSx,
} from "../../../components/ui/views/ListView";

import HeaderLabel from "../../../components/ui/HeaderLabel";
import type { VehicleRegistrationEmployee } from "../../vehicle_registration_employee";
import { useVehicleRegistrationEmployeesByEmployee } from "../../vehicle_registration_employee/hooks/useVehicleRegistrationEmployeesByEmployee";
import { useVehicleRegistrationEmployees } from "../../vehicle_registration_employee/hooks/useVehicleRegistrationEmployees";
import { useUpdateVehicleRegistrationEmployee } from "../../vehicle_registration_employee/hooks/useUpdateVehicleRegistrationEmployee";
import { useVehicles } from "../../vehicles/hooks/useVehicles";
import ResolveVehicleRegistrationTaskDialog from "../../vehicle_registration_employee/components/ResolveVehicleRegistrationTaskDialog";
import {
  isFinalStatus,
  tagForStatus,
} from "../../vehicle_registration_employee/utils/taskStatus";

type RequestView = {
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

export default function VehicleRegistrationTasksTab() {
  const { t } = useTranslation();
  const { userId, role } = useAuthStore();
  const { employeeRows = [], isLoading: employeesLoading } = useEmployees();
  const { vehiclesRows = [] } = useVehicles();
  const myEmployeeId = useMemo<number | null>(() => {
    if (!userId) return null;
    const me = employeeRows.find((e: any) => e.applicationUserId === userId);
    return me?.id ?? null;
  }, [employeeRows, userId]);

  const shouldShowNone =
    !employeesLoading && role !== "Admin" && myEmployeeId == null;

  const [selectedAdminEmployeeId, setSelectedAdminEmployeeId] = useState<
    number | null
  >(null);

  const isAdmin = role === "Admin";
  const queryEmployeeId = isAdmin
    ? selectedAdminEmployeeId
    : Number.isFinite(myEmployeeId ?? NaN)
    ? Number(myEmployeeId)
    : 0;

  // Use paged getAll if Admin and no employee selected
  const {
    vehicleRegistrationEmployeesRows: allTasks = [],
    isLoading: isAllLoading,
  } = useVehicleRegistrationEmployees({
    enabled: isAdmin && queryEmployeeId === null,
  });

  // Use byEmployee if filtering or if regular user
  const { data: filteredTasks = [], isLoading: isFilteredLoading } =
    useVehicleRegistrationEmployeesByEmployee(queryEmployeeId ?? 0, {
      enabled: queryEmployeeId !== null && queryEmployeeId > 0,
    });

  const tasks = useMemo(() => {
    if (isAdmin && queryEmployeeId === null) return allTasks;
    return filteredTasks;
  }, [isAdmin, queryEmployeeId, allTasks, filteredTasks]);

  const isLoading = isAllLoading || isFilteredLoading;

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

  const taskViews = useMemo<RequestView[]>(() => {
    return tasks.map((task) => {
      const vehicle = vehicleById.get(task.vehicleId);
      const deadline = formatDate(task.expiresOn);
      const projectName = vehicle?.name ?? `Vehicle #${task.vehicleId}`;

      const title =
        vehicle && (vehicle.brand || vehicle.model)
          ? `${vehicle.brand ?? ""} ${vehicle.model ?? ""}`.trim()
          : `Vehicle registration request #${task.id}`;

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

  const sections = useMemo<Array<ListViewSection<RequestView>>>(() => {
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

    const out: Array<ListViewSection<RequestView>> = [
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

  const sectionKeys = useMemo(() => sections.map((s) => s.key), [sections]);
  const sectionKeysSig = useMemo(() => sectionKeys.join("|"), [sectionKeys]);

  useEffect(() => {
    setOpenByKey((prev) => {
      const next: Record<string, boolean> = {};
      let changed = false;

      for (const key of sectionKeys) {
        if (prev[key] === undefined) {
          next[key] = true;
          changed = true;
        } else {
          next[key] = prev[key];
        }
      }

      if (!changed) {
        const prevKeys = Object.keys(prev);
        if (prevKeys.length !== sectionKeys.length) changed = true;
        else {
          for (const k of prevKeys) {
            if (!next.hasOwnProperty(k)) {
              changed = true;
              break;
            }
          }
        }
      }

      return changed ? next : prev;
    });
  }, [sectionKeysSig]);

  const toggleSection = useCallback((key: string) => {
    setOpenByKey((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));
  }, []);

  const columns = useMemo<Array<ListViewColumn<RequestView>>>(() => {
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

  const filterOptions = useMemo(() => {
    const allOption = {
      id: null,
      firstName: t("vehicleRegistrationTasks.filter.allEmployees"),
      lastName: "",
    };
    return [allOption, ...employeeRows];
  }, [employeeRows, t]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {isAdmin && (
        <Box sx={{ maxWidth: 400 }}>
          <Autocomplete
            options={filterOptions}
            getOptionLabel={(option: any) => {
              if (option.id === null) return option.firstName;
              return (
                `${option.firstName ?? ""} ${option.lastName ?? ""}`.trim() ||
                option.email ||
                `ID: ${option.id}`
              );
            }}
            value={
              filterOptions.find((e: any) => e.id === selectedAdminEmployeeId) ??
              filterOptions[0]
            }
            onChange={(_, newValue) =>
              setSelectedAdminEmployeeId(newValue?.id ?? null)
            }
            onBlur={() => {}}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("vehicleRegistrationTasks.filter.employee")}
                variant="outlined"
                size="small"
              />
            )}
          />
        </Box>
      )}
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
        <ListView<RequestView>
          sections={sections}
          openByKey={openByKey}
          onToggleSection={toggleSection}
          getRowKey={(row) => String(row.task.id)}
          columns={columns}
          loading={isLoading}
          loadingText={t("common.loading", { defaultValue: "Loading..." })}
        />
      )}

      {resolveDialogOpen && (
        <ResolveVehicleRegistrationTaskDialog
          open={resolveDialogOpen}
          onClose={handleCloseResolveDialog}
          onSuccess={handleCloseResolveDialog}
          task={activeTask}
        />
      )}
    </Stack>
  );
}
