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
  IconButton,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
import { useMemo, useState } from "react";

import {
  TimelineView,
  type Lane,
  type TimelineItem,
} from "../../../components/ui/views/TimelineView";

import { getEmployeeInitials, getEmployeeLabel } from "../utils/employee";
import { formatIsoDate } from "../utils/date";
import StatCardDetail from "../../../components/ui/StatCardDetail";

import {
  addDays,
  makeWeekRangeFormatter,
  formatWeekRange,
} from "../../../utils/dateFormatters";
import { getIntlLocale } from "../../../utils/u18nLocale";

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

const AssignmentsListPage = () => {
  const { t, i18n } = useTranslation();
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
  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeekMonday(new Date())
  );

  const effectiveEmployeeId =
    role === "Admin"
      ? typeof selectedEmployeeId === "number"
        ? selectedEmployeeId
        : null
      : myUserId;

  const handleSelectChange = (e: SelectChangeEvent<number | "">) => {
    const v = e.target.value;
    if (v === "" || v === undefined || v === null) {
      setSelectedEmployeeId("");
      return;
    }
    const num = typeof v === "number" ? v : Number(v);
    setSelectedEmployeeId(Number.isFinite(num) ? num : "");
  };

  const selectedEmployee = useMemo(
    () =>
      typeof selectedEmployeeId === "number"
        ? employeeRows.find((e) => e.id === selectedEmployeeId) ?? null
        : null,
    [selectedEmployeeId, employeeRows]
  );

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

  const startDate = useMemo(() => toIsoDate(weekStart), [weekStart]);
  const endDate = useMemo(() => toIsoDate(addDays(weekStart, 6)), [weekStart]);

  const locale = useMemo(
    () => getIntlLocale(i18n),
    [i18n.language, i18n.resolvedLanguage]
  );

  const weekRangeFmt = useMemo(() => makeWeekRangeFormatter(locale), [locale]);

  const weekLabel = useMemo(
    () => formatWeekRange(weekStart, weekRangeFmt),
    [weekStart, weekRangeFmt]
  );

  const { lanes, items } = useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);

    const employeesInScope =
      effectiveEmployeeId == null
        ? employeeRows
        : employeeRows.filter((e) => e.id === effectiveEmployeeId);

    const lanes: Lane[] = employeesInScope.map((e) => ({
      id: String(e.id),
      title: getEmployeeLabel(e),
      initials: getEmployeeInitials(e),
    }));

    const UNASSIGNED_ID = "unassigned";
    const hasUnassigned =
      constructionAssignments.some((r) => r.employeeId == null) ||
      vehicleAssignments.some((r) => r.responsibleEmployeeId == null) ||
      toolAssignments.some((r) => r.responsibleEmployeeId == null);

    if (hasUnassigned && effectiveEmployeeId == null) {
      lanes.unshift({
        id: UNASSIGNED_ID,
        title: t("assignments.timeline.unassigned", "Unassigned"),
        initials: "?",
      });
    }

    const items: TimelineItem[] = [];

    const laneForEmployee = (id?: number | null) => {
      if (id == null) return UNASSIGNED_ID;
      return String(id);
    };

    const findEmp = (id?: number | null) =>
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

      const emp = findEmp(row.employeeId);

      const csTitle =
        row.name || row.location || t("assignments.timeline.constructionItem");

      const csSubtitle = [
        row.location && row.name ? row.location : null,
        row.siteManagerName ? `Mgr: ${row.siteManagerName}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      items.push({
        id: `cs-${row.constructionSiteId}-${
          row.employeeId ?? "x"
        }-${start}-${end}`,
        laneId: laneForEmployee(row.employeeId),
        title: csTitle,
        subtitle: csSubtitle || undefined,
        startDate: start,
        endDate: end,
        color: "#F1B103",
        assigneeName: emp ? getEmployeeLabel(emp) : undefined,
        assigneeInitials: emp ? getEmployeeInitials(emp) : undefined,
        meta: {
          type: "construction",
          laneLabel: t("assignments.timeline.laneConstruction"),
        },
      });
    });

    vehicleAssignments.forEach((row) => {
      const start = row.dateFrom || todayIso;
      const end = row.dateTo || start;

      const emp = findEmp(row.responsibleEmployeeId);

      const vehicleTitle =
        row.registrationNumber || t("assignments.timeline.vehicleItem");

      const vehicleSubtitle = [
        [row.brand, row.model, row.vehicleType].filter(Boolean).join(" "),
        row.constructionSiteName || row.constructionSiteLocation,
      ]
        .filter(Boolean)
        .join(" · ");

      items.push({
        id: `veh-${row.vehicleId}-${
          row.responsibleEmployeeId ?? "x"
        }-${start}-${end}`,
        laneId: laneForEmployee(row.responsibleEmployeeId),
        title: vehicleTitle,
        subtitle: vehicleSubtitle || undefined,
        startDate: start,
        endDate: end,
        color: "#04befe",
        assigneeName: emp ? getEmployeeLabel(emp) : undefined,
        assigneeInitials: emp ? getEmployeeInitials(emp) : undefined,
        meta: {
          type: "vehicle",
          laneLabel: t("assignments.timeline.laneVehicles"),
        },
      });
    });

    toolAssignments.forEach((row) => {
      const start = row.dateFrom || todayIso;
      const end = row.dateTo || start;

      const emp = findEmp(row.responsibleEmployeeId);

      const toolTitle =
        row.name || row.inventoryNumber || t("assignments.timeline.toolItem");

      const toolSubtitle =
        row.inventoryNumber && row.name ? `#${row.inventoryNumber}` : undefined;

      items.push({
        id: `tool-${row.toolId}-${
          row.responsibleEmployeeId ?? "x"
        }-${start}-${end}`,
        laneId: laneForEmployee(row.responsibleEmployeeId),
        title: toolTitle,
        subtitle: toolSubtitle,
        startDate: start,
        endDate: end,
        color: "#21D191",
        assigneeName: emp ? getEmployeeLabel(emp) : undefined,
        assigneeInitials: emp ? getEmployeeInitials(emp) : undefined,
        meta: {
          type: "tool",
          laneLabel: t("assignments.timeline.laneTools"),
        },
      });
    });

    const filteredItems =
      effectiveEmployeeId == null
        ? items
        : items.filter((it) => it.laneId === String(effectiveEmployeeId));

    return { lanes, items: filteredItems };
  }, [
    employeeRows,
    effectiveEmployeeId,
    constructionAssignments,
    vehicleAssignments,
    toolAssignments,
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setWeekStart((d) => addDays(d, -7))}
            aria-label={t("assignments.timeline.prevWeek", "Previous week")}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {weekLabel}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setWeekStart((d) => addDays(d, 7))}
            aria-label={t("assignments.timeline.nextWeek", "Next week")}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {role === "Admin" && (
        <>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                  flexBasis: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                    md: "calc(33.333% - 12px)",
                  },
                  flexGrow: 1,
                }}
              >
                <StatCardDetail
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
                  flexBasis: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                    md: "calc(33.333% - 12px)",
                  },
                  flexGrow: 1,
                }}
              >
                <StatCardDetail
                  icon={<CalendarTodayIcon />}
                  label={t("assignments.employee.dates")}
                  value={
                    selectedEmployee.dateOfBirth
                      ? `${t("assignments.employee.birthDate")} ${formatIsoDate(
                          selectedEmployee.dateOfBirth
                        )}`
                      : t("assignments.employee.birthDateUnknown")
                  }
                  caption={
                    selectedEmployee.employmentDate
                      ? `${t(
                          "assignments.employee.employedFrom"
                        )} ${formatIsoDate(selectedEmployee.employmentDate)}`
                      : t("assignments.employee.notEmployed")
                  }
                />
              </Box>

              <Box
                sx={{
                  flexBasis: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                    md: "calc(33.333% - 12px)",
                  },
                  flexGrow: 1,
                }}
              >
                <StatCardDetail
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

      {isLoadingTimeline ? (
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
