import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useCurrentEmployeeContext } from "../../auth/hooks/useCurrentEmployeeContext";
import { getEmployeeLabel } from "../../../utils/employeeUtils";
import StatCardDetail from "../../../components/ui/dashboard/StatCardDetail";
import { formatIsoDate, startOfWeekMonday } from "../../assignments/utils/date";

import { addDays, formatLocalIsoDate } from "../../../utils/dateFormatters";
import { getIntlLocale } from "../../../utils/u18nLocale";
import { buildWeekDays, shiftRange } from "../utils/workHoursDateUtils";

import { useConstructionSiteEmployeeWorkLogsAll } from "../../construction_site/hooks/useConstructionSiteEmployeeWorkLogsAll";
import { useEmployeeOptions } from "../../constants/options/useEmployeeOptions";
import WorkHoursWeekList from "../../../components/ui/views/WorkHourList";
import { useConstructionSiteOptions } from "../../constants/options/useConstructionSiteOptions";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import type { DateRange } from "@mui/x-date-pickers-pro/models";
import WorkHoursCreateDialog from "./WorkHoursCreateDialog";

const WorkHoursListPage = () => {
  const { t, i18n } = useTranslation();

  const { employeeRows = [] } = useEmployees();
  const { options: employeeOptions } = useEmployeeOptions();
  const { options: constructionSiteOptions } = useConstructionSiteOptions();

  const { isAdmin, employeeId } = useCurrentEmployeeContext();
  const myEmployeeId = employeeId;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [selectedConstructionSiteId, setSelectedConstructionSiteId] = useState<number | "">("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [range, setRange] = useState<DateRange<Date>>(() => {
    const start = startOfWeekMonday(new Date());
    return [start, addDays(start, 6)];
  });

  const locale = useMemo(
    () => getIntlLocale(i18n),
    [i18n.language, i18n.resolvedLanguage],
  );

  const startDate = useMemo(() => {
    const d = range[0];
    return d ? formatLocalIsoDate(d) : undefined;
  }, [range]);

  const endDate = useMemo(() => {
    const d = range[1];
    return d ? formatLocalIsoDate(d) : undefined;
  }, [range]);

  useEffect(() => {
    if (!isAdmin && myEmployeeId) setSelectedEmployeeId(myEmployeeId);
  }, [isAdmin, myEmployeeId]);

  const effectiveEmployeeId: number | null = useMemo(() => {
    if (isAdmin) {
      return typeof selectedEmployeeId === "number" ? selectedEmployeeId : null;
    }
    return myEmployeeId ?? null;
  }, [isAdmin, selectedEmployeeId, myEmployeeId]);

  const handleSelectChange = (e: SelectChangeEvent<number | "">) => {
    if (!isAdmin) return;
    const v = e.target.value;
    if (v === "") {
      setSelectedEmployeeId("");
      return;
    }
    const num = typeof v === "number" ? v : Number(v);
    setSelectedEmployeeId(Number.isFinite(num) ? num : "");
  };

  const handleSiteSelectChange = (e: SelectChangeEvent<number | "">) => {
    const v = e.target.value;
    if (v === "") {
      setSelectedConstructionSiteId("");
      return;
    }
    const num = typeof v === "number" ? v : Number(v);
    setSelectedConstructionSiteId(Number.isFinite(num) ? num : "");
  };

  const selectedEmployee =
    effectiveEmployeeId != null
      ? (employeeRows.find((e) => e.id === effectiveEmployeeId) ?? null)
      : null;

  const { rows, isLoading, isError, error, setPaginationModel } =
    useConstructionSiteEmployeeWorkLogsAll({
      employeeId: effectiveEmployeeId ?? undefined,
      constructionSiteId: typeof selectedConstructionSiteId === "number" ? selectedConstructionSiteId : undefined,
      dateFrom: startDate,
      dateTo: endDate,
    });

  useEffect(() => {
    setPaginationModel((p) => ({ ...p, page: 0, pageSize: 500 }));
  }, [setPaginationModel, startDate, endDate, effectiveEmployeeId, selectedConstructionSiteId]);

  const weekDays = useMemo(() => {
    return buildWeekDays(range, locale);
  }, [range, locale]);

  const employeesById = useMemo(() => {
    const m = new Map<number, any>();
    (employeeRows ?? []).forEach((e: any) => {
      if (typeof e?.id === "number") m.set(e.id, e);
    });
    return m;
  }, [employeeRows]);

  const handlePrevRange = () => setRange((r) => shiftRange(r, -1));
  const handleNextRange = () => setRange((r) => shiftRange(r, 1));

  const navBtnSx = {
    width: 40,
    height: 40,
    borderRadius: 1,
    p: 0,
    border: "1px solid #C4C4C4",
    backgroundColor: "#FFFFFF",
    color: "#64748B",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
    "&.Mui-disabled": {
      opacity: 0.5,
      borderColor: "#C4C4C4",
      color: "#94A3B8",
    },
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            {t("workHours.title")}
          </Typography>

          <Button
            size="small"
            variant="contained"
            onClick={() => setCreateDialogOpen(true)}
          >
            {t("workHours.record")}
          </Button>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            bgcolor: "background.paper",
            border: "1px solid #E5E7EB",
            flexWrap: { xs: "nowrap", md: "wrap" },
          }}
        >
          <FormControl
            size="small"
            sx={{ minWidth: 260, width: { xs: "100%", md: "auto" } }}
            variant="outlined"
          >
            <InputLabel id="employee-select-label" shrink>
              {t("assignments.filterByEmployee")}
            </InputLabel>

            <Select<number | "">
              labelId="employee-select-label"
              id="employee-select"
              label={t("assignments.filterByEmployee")}
              value={isAdmin ? selectedEmployeeId : (myEmployeeId ?? "")}
              onChange={handleSelectChange}
              displayEmpty
              disabled={!isAdmin}
              renderValue={(val) => {
                if (!isAdmin) {
                  const emp = employeeRows.find((x) => x.id === myEmployeeId);
                  return emp ? getEmployeeLabel(emp) : `#${myEmployeeId ?? ""}`;
                }

                if (val === "") return <em>{t("assignments.allEmployees")}</em>;
                const id = typeof val === "number" ? val : Number(val);
                const opt = employeeOptions.find((o) => o.value === id);
                return opt ? opt.label : `#${id}`;
              }}
            >
              {isAdmin && (
                <MenuItem value="">
                  <em>{t("assignments.allEmployees")}</em>
                </MenuItem>
              )}

              {employeeOptions.map((o) => (
                <MenuItem key={o.value} value={o.value} disabled={!isAdmin}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{ minWidth: 260, width: { xs: "100%", md: "auto" } }}
            variant="outlined"
          >
            <InputLabel id="site-select-label" shrink>
              {t("constructionSites.list.filterBySite")}
            </InputLabel>
            <Select<number | "">
              labelId="site-select-label"
              id="site-select"
              label={t("constructionSites.list.filterBySite")}
              value={selectedConstructionSiteId}
              onChange={handleSiteSelectChange}
              displayEmpty
              renderValue={(val) => {
                if (val === "") return <em>{t("common.allSites")}</em>;
                const id = typeof val === "number" ? val : Number(val);
                const opt = constructionSiteOptions.find((o) => o.value === id);
                return opt ? opt.label : `#${id}`;
              }}
            >
              <MenuItem value="">
                <em>{t("common.allSites")}</em>
              </MenuItem>
              {constructionSiteOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", md: "auto" },
              justifyContent: "space-between",
            }}
          >
            <IconButton size="small" onClick={handlePrevRange} sx={navBtnSx}>
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <DateRangePicker
              value={range}
              onChange={(newValue) => setRange(newValue)}
              calendars={2}
              slots={{ field: SingleInputDateRangeField }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: { xs: 0, md: 240 },
                    width: "100%",
                    "& .MuiInputBase-root": {
                      height: 40, // Standardize height with Select
                      borderRadius: 1,
                    },
                    "& .MuiInputBase-input": {
                      py: 0,
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                      color: "#64748B",
                    },
                  },
                },
              }}
            />

            <IconButton size="small" onClick={handleNextRange} sx={navBtnSx}>
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Paper>

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
                label={t("workHours.employee.info")}
                value={getEmployeeLabel(selectedEmployee)}
                caption={
                  selectedEmployee.oib
                    ? `OIB: ${selectedEmployee.oib}`
                    : t("workHours.employee.noOib")
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
                label={t("workHours.employee.dates")}
                value={
                  selectedEmployee.dateOfBirth
                    ? `${t("workHours.employee.birthDate")} ${formatIsoDate(
                        selectedEmployee.dateOfBirth,
                      )}`
                    : t("workHours.employee.birthDateUnknown")
                }
                caption={
                  selectedEmployee.employmentDate
                    ? `${t("workHours.employee.employedFrom")} ${formatIsoDate(
                        selectedEmployee.employmentDate,
                      )}`
                    : t("workHours.employee.notEmployed")
                }
              />
            </Box>
          </Box>
        )}

        <WorkHoursWeekList
          employeesById={employeesById}
          weekDays={weekDays}
          rows={rows as any}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
        />
        
        <WorkHoursCreateDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default WorkHoursListPage;
