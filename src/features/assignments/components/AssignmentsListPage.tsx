import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  CircularProgress,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TimelineIcon from "@mui/icons-material/Timeline";

import { useAssignedVehicles } from "../../administration/employees/hooks/useAssignedVehicles";
import { useAssignedConstructionSites } from "../../administration/employees/hooks/useAssignedConstructionSites";
import { useAssignedTools } from "../../administration/employees/hooks/useAssignedTools";

import type {
  AssignedConstructionSite,
  AssignedTool,
  AssignedVehicle,
} from "../../administration/employees";

import { useAuthStore } from "../../auth/store/useAuthStore";
import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useTranslation } from "react-i18next";
import { AssignmentsBoardView } from "./AssignmentsBoardView";

import { useMemo, useState } from "react";
import StatCard from "../../construction_site/components/StatCard";

import {
  TimelineView,
  type Lane,
  type TimelineItem,
} from "../../../components/ui/views/TimelineView";
import { ViewSelect } from "../../../components/ui/select/ViewSelect";

type ViewMode = "board" | "timeline";

const AssignmentsListPage = () => {
  const { t } = useTranslation();
  const { employeeRows = [] } = useEmployees();

  const { acsRows, isLoading: isLoadingSites } = useAssignedConstructionSites();
  const { vehicleRows, isLoading: isLoadingVehicles } = useAssignedVehicles();
  const { toolRows, isLoading: isLoadingTools } = useAssignedTools();

  const { userId, role } = useAuthStore();

  const myUserId = useMemo(() => {
    const n =
      typeof userId === "string"
        ? parseInt(userId, 10)
        : typeof userId === "number"
        ? userId
        : NaN;
    return Number.isFinite(n) ? n : null;
  }, [userId]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  const effectiveEmployeeId =
    role === "Admin"
      ? typeof selectedEmployeeId === "number"
        ? selectedEmployeeId
        : null
      : myUserId;

  const dedupeByKey = <T, K extends string | number>(
    rows: T[],
    getKey: (row: T) => K
  ): T[] => {
    const map = new Map<K, T>();
    for (const r of rows) {
      const key = getKey(r);
      if (!map.has(key)) {
        map.set(key, r);
      }
    }
    return Array.from(map.values());
  };

  const constructionRowsForBoard = useMemo<AssignedConstructionSite[]>(() => {
    const rows =
      effectiveEmployeeId == null
        ? acsRows
        : acsRows.filter((r) => r.employeeId === effectiveEmployeeId);

    if (effectiveEmployeeId == null) {
      return dedupeByKey(rows, (r) => r.constructionSiteId);
    }

    return rows;
  }, [acsRows, effectiveEmployeeId]);

  const vehicleRowsForBoard = useMemo<AssignedVehicle[]>(() => {
    const rows =
      effectiveEmployeeId == null
        ? vehicleRows
        : vehicleRows.filter(
            (r) => r.responsibleEmployeeId === effectiveEmployeeId
          );

    if (effectiveEmployeeId == null) {
      return dedupeByKey(rows, (r) => r.vehicleId);
    }

    return rows;
  }, [vehicleRows, effectiveEmployeeId]);

  const toolRowsForBoard = useMemo<AssignedTool[]>(() => {
    const rows =
      effectiveEmployeeId == null
        ? toolRows
        : toolRows.filter(
            (r) => r.responsibleEmployeeId === effectiveEmployeeId
          );

    if (effectiveEmployeeId == null) {
      return dedupeByKey(rows, (r) => r.toolId);
    }

    return rows;
  }, [toolRows, effectiveEmployeeId]);

  const getEmployeeLabel = (e: any) =>
    [e?.firstName, e?.lastName].filter(Boolean).join(" ") || `#${e?.id}`;

  const getEmployeeInitials = (e: any) => {
    const first = e?.firstName?.[0] ?? "";
    const last = e?.lastName?.[0] ?? "";
    const initials = `${first}${last}`.trim();
    return initials || (e?.id != null ? String(e.id).slice(-2) : "?");
  };

  const handleSelectChange = (e: SelectChangeEvent<number | "">) => {
    const v = e.target.value;
    if (v === "" || v === undefined || v === null) {
      setSelectedEmployeeId("");
    } else {
      const num = typeof v === "number" ? v : Number(v);
      setSelectedEmployeeId(Number.isFinite(num) ? num : "");
    }
  };

  const selectedEmployee = useMemo(
    () =>
      typeof selectedEmployeeId === "number"
        ? employeeRows.find((e) => e.id === selectedEmployeeId) ?? null
        : null,
    [selectedEmployeeId, employeeRows]
  );

  const formatIso = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  };

  const employeeAssignmentsCount = selectedEmployee
    ? {
        construction: acsRows.filter(
          (r) => r.employeeId === selectedEmployee.id
        ).length,
        vehicles: vehicleRows.filter(
          (r) => r.responsibleEmployeeId === selectedEmployee.id
        ).length,
        tools: toolRows.filter(
          (r) => r.responsibleEmployeeId === selectedEmployee.id
        ).length,
      }
    : { construction: 0, vehicles: 0, tools: 0 };

  const cardBoxSx = {
    flexBasis: {
      xs: "100%",
      sm: "calc(50% - 8px)",
      md: "calc(33.333% - 12px)",
    },
    flexGrow: 1,
  } as const;

  const constructionAssignments = useMemo<AssignedConstructionSite[]>(
    () =>
      effectiveEmployeeId == null
        ? acsRows
        : acsRows.filter((r) => r.employeeId === effectiveEmployeeId),
    [acsRows, effectiveEmployeeId]
  );

  const vehicleAssignments = useMemo<AssignedVehicle[]>(
    () =>
      effectiveEmployeeId == null
        ? vehicleRows
        : vehicleRows.filter(
            (r) => r.responsibleEmployeeId === effectiveEmployeeId
          ),
    [vehicleRows, effectiveEmployeeId]
  );

  const toolAssignments = useMemo<AssignedTool[]>(
    () =>
      effectiveEmployeeId == null
        ? toolRows
        : toolRows.filter(
            (r) => r.responsibleEmployeeId === effectiveEmployeeId
          ),
    [toolRows, effectiveEmployeeId]
  );

  const isLoadingTimeline =
    isLoadingSites || isLoadingVehicles || isLoadingTools;

  const { lanes, items, startDate, endDate } = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);

    const lanes: Lane[] = [
      {
        id: "construction",
        title: t("assignments.timeline.laneConstruction"),
      },
      {
        id: "vehicles",
        title: t("assignments.timeline.laneVehicles"),
      },
      {
        id: "tools",
        title: t("assignments.timeline.laneTools"),
      },
    ];

    const items: TimelineItem[] = [];

    const addItem = (item: TimelineItem) => items.push(item);

    const findEmployee = (id?: number | null) =>
      id == null ? null : employeeRows.find((e) => e.id === id) ?? null;

    constructionAssignments.forEach((row) => {
      const start =
        row.dateFrom || row.startDate || row.plannedEndDate || todayIso;
      const end =
        row.dateTo ||
        row.plannedEndDate ||
        row.startDate ||
        row.dateFrom ||
        start;

      const employee = findEmployee(row.employeeId);
      const assigneeName = employee ? getEmployeeLabel(employee) : undefined;
      const assigneeInitials = employee
        ? getEmployeeInitials(employee)
        : undefined;

      addItem({
        id: `cs-${row.constructionSiteId}-${
          row.employeeId ?? "x"
        }-${start}-${end}`,
        laneId: "construction",
        title:
          row.name ||
          row.location ||
          t("assignments.timeline.constructionItem"),
        startDate: start,
        endDate: end,
        color: "#F1B103",
        assigneeName,
        assigneeInitials,
      });
    });

    vehicleAssignments.forEach((row) => {
      const start = row.dateFrom || todayIso;
      const end = row.dateTo || start;

      const employee = findEmployee(row.responsibleEmployeeId);
      const assigneeName = employee ? getEmployeeLabel(employee) : undefined;
      const assigneeInitials = employee
        ? getEmployeeInitials(employee)
        : undefined;

      const label =
        row.registrationNumber ||
        [row.constructionSiteName, row.constructionSiteLocation]
          .filter(Boolean)
          .join(" · ") ||
        t("assignments.timeline.vehicleItem");

      addItem({
        id: `veh-${row.vehicleId}-${
          row.responsibleEmployeeId ?? "x"
        }-${start}-${end}`,
        laneId: "vehicles",
        title: label,
        startDate: start,
        endDate: end,
        color: "#04befe",
        assigneeName,
        assigneeInitials,
      });
    });

    toolAssignments.forEach((row) => {
      const start = row.dateFrom || todayIso;
      const end = row.dateTo || start;

      const employee = findEmployee(row.responsibleEmployeeId);
      const assigneeName = employee ? getEmployeeLabel(employee) : undefined;
      const assigneeInitials = employee
        ? getEmployeeInitials(employee)
        : undefined;

      const label =
        row.name || row.inventoryNumber || t("assignments.timeline.toolItem");

      addItem({
        id: `tool-${row.toolId}-${
          row.responsibleEmployeeId ?? "x"
        }-${start}-${end}`,
        laneId: "tools",
        title: label,
        startDate: start,
        endDate: end,
        color: "#21D191",
        assigneeName,
        assigneeInitials,
      });
    });

    // compute overall date range
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    items.forEach((it) => {
      const s = new Date(it.startDate);
      const e = new Date(it.endDate);
      if (!Number.isNaN(s.getTime())) {
        if (!minDate || s < minDate) minDate = s;
      }
      if (!Number.isNaN(e.getTime())) {
        if (!maxDate || e > maxDate) maxDate = e;
      }
    });

    if (!minDate || !maxDate) {
      const today = new Date();
      minDate = today;
      maxDate = today;
    }

    const startIso = minDate.toISOString().slice(0, 10);
    const endIso = maxDate.toISOString().slice(0, 10);

    return { lanes, items, startDate: startIso, endDate: endIso };
  }, [
    constructionAssignments,
    vehicleAssignments,
    toolAssignments,
    employeeRows,
    t,
  ]);

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("assignments.title")}
        </Typography>

        <ViewSelect
          value={viewMode}
          onChange={(val) => setViewMode(val as ViewMode)}
          options={[
            {
              value: "board",
              label: t("assignments.view.board"),
              icon: <ViewModuleIcon />,
            },
            {
              value: "timeline",
              label: t("assignments.view.timeline"),
              icon: <TimelineIcon />,
            },
          ]}
        />
      </Box>

      {role === "Admin" && (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 280 }} variant="outlined">
              <InputLabel id="employee-select-label" shrink>
                {t("assignments.filterByEmployee")}
              </InputLabel>
              <Select<number | "">
                labelId="employee-select-label"
                id="employee-select"
                label={t("assignments.filterByEmployee")}
                value={selectedEmployeeId}
                onChange={handleSelectChange}
                displayEmpty
                renderValue={(val) => {
                  if (val === "")
                    return <em>{t("assignments.allEmployees")}</em>;
                  const id = typeof val === "number" ? val : Number(val);
                  const emp = employeeRows.find((x) => x.id === id);
                  return emp ? getEmployeeLabel(emp) : `#${id}`;
                }}
              >
                <MenuItem value="">
                  <em>{t("assignments.allEmployees")}</em>
                </MenuItem>
                {employeeRows.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {getEmployeeLabel(e)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedEmployee && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box
                sx={{
                  ...cardBoxSx,
                  "@keyframes slideDownFadeIn": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(-12px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  animation: "slideDownFadeIn 0.25s ease-out",
                  animationFillMode: "backwards",
                  animationDelay: "0ms",
                }}
              >
                <StatCard
                  icon={<BadgeIcon />}
                  label={t("assignments.employee.info")}
                  value={getEmployeeLabel(selectedEmployee)}
                  caption={
                    selectedEmployee.oib
                      ? `OIB: ${selectedEmployee.oib}`
                      : t("assignments.employee.noOib")
                  }
                />
              </Box>

              <Box
                sx={{
                  ...cardBoxSx,
                  "@keyframes slideDownFadeIn2": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(-12px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  animation: "slideDownFadeIn2 0.30s ease-out",
                  animationFillMode: "backwards",
                  animationDelay: "80ms",
                }}
              >
                <StatCard
                  icon={<CalendarTodayIcon />}
                  label={t("assignments.employee.dates")}
                  value={
                    selectedEmployee.dateOfBirth
                      ? `${t("assignments.employee.birthDate")} ${formatIso(
                          selectedEmployee.dateOfBirth
                        )}`
                      : t("assignments.employee.birthDateUnknown")
                  }
                  caption={
                    selectedEmployee.employmentDate
                      ? `${t("assignments.employee.employedFrom")} ${formatIso(
                          selectedEmployee.employmentDate
                        )}`
                      : t("assignments.employee.notEmployed")
                  }
                />
              </Box>

              <Box
                sx={{
                  ...cardBoxSx,
                  "@keyframes slideDownFadeIn3": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(-12px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  animation: "slideDownFadeIn3 0.35s ease-out",
                  animationFillMode: "backwards",
                  animationDelay: "140ms",
                }}
              >
                <StatCard
                  icon={<AssignmentTurnedInIcon />}
                  label={t("assignments.employee.assignments")}
                  value={`${employeeAssignmentsCount.construction} · ${employeeAssignmentsCount.vehicles} · ${employeeAssignmentsCount.tools}`}
                  caption={t("assignments.employee.assignmentsCaption")}
                />
              </Box>
            </Box>
          )}
        </>
      )}

      {viewMode === "board" ? (
        <AssignmentsBoardView
          construction={{
            rows: constructionRowsForBoard,
            loading: isLoadingSites,
          }}
          vehicles={{
            rows: vehicleRowsForBoard,
            loading: isLoadingVehicles,
          }}
          tools={{
            rows: toolRowsForBoard,
            loading: isLoadingTools,
          }}
        />
      ) : isLoadingTimeline ? (
        <Box
          sx={{
            width: "100%",
            mt: 1,
            display: "flex",
            justifyContent: "center",
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ width: "100%", mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t("assignments.timeline.empty")}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: "100%", mt: 1 }}>
          <TimelineView
            lanes={lanes}
            items={items}
            startDate={startDate}
            endDate={endDate}
          />
        </Box>
      )}
    </Stack>
  );
};

export default AssignmentsListPage;
