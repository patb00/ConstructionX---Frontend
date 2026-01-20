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
  TextField,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useCurrentEmployeeContext } from "../../auth/hooks/useCurrentEmployeeContext";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";

import {
  TimelineView,
  type Lane,
  type TimelineItem,
} from "../../../components/ui/views/TimelineView";

import {
  formatIsoDate,
  startOfWeekMonday,
  toTimeSpanStrict,
} from "../utils/date";
import StatCardDetail from "../../../components/ui/dashboard/StatCardDetail";

import {
  addDays,
  makeWeekRangeFormatter,
  formatWeekRange,
  formatLocalIsoDate,
} from "../../../utils/dateFormatters";
import { getIntlLocale } from "../../../utils/u18nLocale";
import {
  getEmployeeInitials,
  getEmployeeLabel,
} from "../../../utils/employeeUtils";
import { useConstructionSiteEmployeeWorkLogs } from "../../construction_site/hooks/useConstructionSiteEmployeeWorkLogs";
import { useUpsertConstructionSiteEmployeeWorkLogs } from "../../construction_site/hooks/useUpsertConstructionSiteEmployeeWorkLogs";
import type {
  ConstructionSiteEmployeeWorkLogDay,
  UpsertConstructionSiteEmployeeWorkLogsRequest,
} from "../../construction_site";
import { AssignTaskDialog } from "../../../components/ui/assign-dialog/AssignTaskDialog";

type WorkLogDraft = {
  constructionSiteId: number;
  employeeId: number;
  workDate: string;
  startTime: string;
  endTime: string;
};

const AssignmentsListPage = () => {
  const { t, i18n } = useTranslation();
  const { employeeRows = [] } = useEmployees();

  const { acsRows, isLoading: isLoadingSites } = useAssignedConstructionSites();
  const { vehicleRows, isLoading: isLoadingVehicles } = useAssignedVehicles();
  const { toolRows, isLoading: isLoadingTools } = useAssignedTools();

  const { isAdmin, employeeId } = useCurrentEmployeeContext();
  const myEmployeeId = employeeId;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeekMonday(new Date()),
  );

  const [workLogOpen, setWorkLogOpen] = useState(false);
  const [workLogDraft, setWorkLogDraft] = useState<WorkLogDraft | null>(null);

  const upsertWorkLogs = useUpsertConstructionSiteEmployeeWorkLogs();

  const { data: employeeSiteLogs } = useConstructionSiteEmployeeWorkLogs(
    workLogDraft?.constructionSiteId,
    workLogDraft?.employeeId,
  );

  console.log("employeeSiteLogs", employeeSiteLogs);

  useEffect(() => {
    if (!workLogDraft) return;
    if (!employeeSiteLogs) return;

    const existing = employeeSiteLogs.find(
      (x) => x.workDate === workLogDraft.workDate,
    );
    if (!existing) return;

    setWorkLogDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        startTime: prev.startTime || existing.startTime || "",
        endTime: prev.endTime || existing.endTime || "",
      };
    });
  }, [employeeSiteLogs, workLogDraft]);

  const effectiveEmployeeId: number | null = isAdmin
    ? typeof selectedEmployeeId === "number"
      ? selectedEmployeeId
      : null
    : myEmployeeId;

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
        ? (employeeRows.find((e) => e.id === selectedEmployeeId) ?? null)
        : null,
    [selectedEmployeeId, employeeRows],
  );

  const employeeAssignmentsCount = selectedEmployee
    ? {
        construction: acsRows.filter(
          (r) => r.employeeId === selectedEmployee.id,
        ).length,
        vehicles: vehicleRows.filter(
          (r) => r.responsibleEmployeeId === selectedEmployee.id,
        ).length,
        tools: toolRows.filter(
          (r) => r.responsibleEmployeeId === selectedEmployee.id,
        ).length,
      }
    : { construction: 0, vehicles: 0, tools: 0 };

  const canShowAll = isAdmin && effectiveEmployeeId == null;
  const shouldShowNone = !isAdmin && effectiveEmployeeId == null;

  const constructionAssignments = useMemo<AssignedConstructionSite[]>(() => {
    if (shouldShowNone) return [];
    if (canShowAll) return acsRows;
    return acsRows.filter((r) => r.employeeId === effectiveEmployeeId);
  }, [acsRows, canShowAll, shouldShowNone, effectiveEmployeeId]);

  const vehicleAssignments = useMemo<AssignedVehicle[]>(() => {
    if (shouldShowNone) return [];
    if (canShowAll) return vehicleRows;
    return vehicleRows.filter(
      (r) => r.responsibleEmployeeId === effectiveEmployeeId,
    );
  }, [vehicleRows, canShowAll, shouldShowNone, effectiveEmployeeId]);

  const toolAssignments = useMemo<AssignedTool[]>(() => {
    if (shouldShowNone) return [];
    if (canShowAll) return toolRows;
    return toolRows.filter(
      (r) => r.responsibleEmployeeId === effectiveEmployeeId,
    );
  }, [toolRows, canShowAll, shouldShowNone, effectiveEmployeeId]);

  const isLoadingTimeline =
    isLoadingSites || isLoadingVehicles || isLoadingTools;

  const startDate = useMemo(() => formatLocalIsoDate(weekStart), [weekStart]);
  const endDate = useMemo(
    () => formatLocalIsoDate(addDays(weekStart, 6)),
    [weekStart],
  );

  const locale = useMemo(
    () => getIntlLocale(i18n),
    [i18n.language, i18n.resolvedLanguage],
  );

  const weekRangeFmt = useMemo(() => makeWeekRangeFormatter(locale), [locale]);

  const weekLabel = useMemo(
    () => formatWeekRange(weekStart, weekRangeFmt),
    [weekStart, weekRangeFmt],
  );

  const { lanes, items } = useMemo(() => {
    const todayIso = formatLocalIsoDate(new Date());

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
      id == null ? null : (employeeRows.find((e) => e.id === id) ?? null);

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

          constructionSiteId: row.constructionSiteId,
          employeeId: row.employeeId ?? undefined,
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

  const handleSaveWorkLog = async () => {
    if (!workLogDraft) return;

    const startTime = toTimeSpanStrict(workLogDraft.startTime);
    const endTime = toTimeSpanStrict(workLogDraft.endTime);

    const payload: UpsertConstructionSiteEmployeeWorkLogsRequest = {
      constructionSiteId: workLogDraft.constructionSiteId,
      employeeId: workLogDraft.employeeId,
      workLogs: [
        {
          workDate: workLogDraft.workDate,
          startTime,
          endTime,
        },
      ],
    };

    await upsertWorkLogs.mutateAsync(payload);
    setWorkLogOpen(false);
    setWorkLogDraft(null);
  };

  const closeWorkLog = () => {
    if (upsertWorkLogs.isPending) return;
    setWorkLogOpen(false);
    setWorkLogDraft(null);
  };

  console.log("lanes", lanes, "items", items);

  return (
    <>
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

        {isAdmin && (
          <>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl
                size="small"
                sx={{ minWidth: 280 }}
                variant="outlined"
              >
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
                        ? `${t(
                            "assignments.employee.birthDate",
                          )} ${formatIsoDate(selectedEmployee.dateOfBirth)}`
                        : t("assignments.employee.birthDateUnknown")
                    }
                    caption={
                      selectedEmployee.employmentDate
                        ? `${t(
                            "assignments.employee.employedFrom",
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
              onItemClick={({ item, dayIso }) => {
                if (item.meta?.type !== "construction") return;

                const constructionSiteId = item.meta?.constructionSiteId;
                const employeeIdFromLane =
                  item.laneId === "unassigned" ? null : Number(item.laneId);
                const employeeIdResolved =
                  item.meta?.employeeId ?? employeeIdFromLane;

                if (!constructionSiteId || !employeeIdResolved) return;

                const existing: ConstructionSiteEmployeeWorkLogDay | undefined =
                  employeeSiteLogs?.find((x) => x.workDate === dayIso);

                setWorkLogDraft({
                  constructionSiteId,
                  employeeId: employeeIdResolved,
                  workDate: dayIso,
                  startTime: existing?.startTime ?? "",
                  endTime: existing?.endTime ?? "",
                });
                setWorkLogOpen(true);
              }}
            />
          </Box>
        )}
      </Stack>

      <AssignTaskDialog
        open={workLogOpen}
        onClose={closeWorkLog}
        title={t("workLogs.dialog.title", "Log hours")}
        subtitle={t("workLogs.dialog.subtitle", "Add start and end time")}
        headerIcon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
        referenceText={
          workLogDraft
            ? `${t("workLogs.dialog.employee", "Employee")} #${
                workLogDraft.employeeId
              }`
            : undefined
        }
        previewTitle={t("workLogs.dialog.detailsTitle", "Details")}
        previewSubtitle={
          workLogDraft
            ? `${t("workLogs.dialog.site", "Construction site")} #${
                workLogDraft.constructionSiteId
              }`
            : ""
        }
        dueLabel={workLogDraft?.workDate ?? undefined}
        dueTone="info"
        previewFields={
          workLogDraft
            ? [
                {
                  label: t("workLogs.dialog.preview.employeeId", "Employee"),
                  value: `#${workLogDraft.employeeId}`,
                  minWidth: 160,
                },
                {
                  label: t("workLogs.dialog.preview.siteId", "Site"),
                  value: `#${workLogDraft.constructionSiteId}`,
                  minWidth: 160,
                },
              ]
            : []
        }
        submitText={t("common.save", "Save")}
        cancelText={t("common.cancel", "Cancel")}
        onSubmit={handleSaveWorkLog}
        submitting={upsertWorkLogs.isPending}
        submitDisabled={!workLogDraft || upsertWorkLogs.isPending}
        formDisabled={upsertWorkLogs.isPending}
      >
        <Stack spacing={1.75}>
          <TextField
            label={t("workLogs.dialog.date", "Date")}
            type="date"
            value={workLogDraft?.workDate ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setWorkLogDraft((p) => (p ? { ...p, workDate: v } : p));
            }}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
            }}
          >
            <TextField
              label={t("workLogs.dialog.startTime", "Start")}
              type="time"
              value={(workLogDraft?.startTime ?? "").slice(0, 5)}
              onChange={(e) =>
                setWorkLogDraft((p) =>
                  p ? { ...p, startTime: e.target.value } : p,
                )
              }
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 60 }}
            />

            <TextField
              label={t("workLogs.dialog.endTime", "End")}
              type="time"
              value={(workLogDraft?.endTime ?? "").slice(0, 5)}
              onChange={(e) =>
                setWorkLogDraft((p) =>
                  p ? { ...p, endTime: e.target.value } : p,
                )
              }
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 60 }}
            />
          </Box>

          <Typography variant="caption" sx={{ color: "#6B7280" }}>
            {t(
              "workLogs.dialog.hint",
              "Times are saved in 24-hour format with minute precision.",
            )}
          </Typography>
        </Stack>
      </AssignTaskDialog>
    </>
  );
};

export default AssignmentsListPage;
