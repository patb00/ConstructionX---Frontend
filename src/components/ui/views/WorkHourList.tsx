import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { SxProps, Theme } from "@mui/material/styles";
import ApartmentIcon from "@mui/icons-material/Apartment";
import {
  getEmployeeInitials,
  getEmployeeLabel,
} from "../../../utils/employeeUtils";
import {
  formatMinutesToHHMM,
  formatSitesLabel,
  getWorkLogMinutes,
} from "../../../utils/workHoursListUtils";

type WeekDay = { iso: string; label: string };

type WorkLogRow = {
  id?: number | string;
  employeeId: number;
  workDate: string;
  constructionSiteName?: string;
  totalWorkMinutes?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

type EmployeeRow = {
  id: number;
  firstName?: string;
  lastName?: string;
  jobPosition?: { id?: number; name?: string } | null;
};

export type WorkHoursWeekListProps = {
  employeesById: Map<number, EmployeeRow>;
  weekDays: WeekDay[];
  rows: WorkLogRow[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  sx?: SxProps<Theme>;
};

export default function WorkHoursWeekList({
  employeesById,
  weekDays,
  rows,
  isLoading,
  isError,
  errorMessage,
  sx,
}: WorkHoursWeekListProps) {
  const { t } = useTranslation();

  const { employeeIds, minutesByEmpByDay, sitesByEmp, totals } = useMemo(() => {
    const minutesByEmpByDay = new Map<number, Map<string, number>>();
    const sitesByEmp = new Map<number, Set<string>>();
    const employeeIds = new Set<number>();

    rows.forEach((r) => {
      const empId = Number(r.employeeId);
      if (!Number.isFinite(empId)) return;
      employeeIds.add(empId);

      const dayIso = r.workDate;
      const mins = getWorkLogMinutes(r);

      const dayMap = minutesByEmpByDay.get(empId) ?? new Map();
      dayMap.set(dayIso, (dayMap.get(dayIso) ?? 0) + mins);
      minutesByEmpByDay.set(empId, dayMap);

      if (r.constructionSiteName) {
        const s = sitesByEmp.get(empId) ?? new Set();
        s.add(r.constructionSiteName);
        sitesByEmp.set(empId, s);
      }
    });

    const perDay = new Map<string, number>();
    let grand = 0;

    const ids = Array.from(employeeIds.values()).sort((a, b) => a - b);
    ids.forEach((empId) => {
      const dayMap = minutesByEmpByDay.get(empId) ?? new Map();
      weekDays.forEach((d) => {
        const mins = dayMap.get(d.iso) ?? 0;
        perDay.set(d.iso, (perDay.get(d.iso) ?? 0) + mins);
        grand += mins;
      });
    });

    return {
      employeeIds: ids,
      minutesByEmpByDay,
      sitesByEmp,
      totals: { perDay, grand },
    };
  }, [rows, weekDays]);

  const columnDivider = "1px solid #EEF2FF";

  const headerCellWithDividerSx: SxProps<Theme> = {
    color: "#6F7295",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "none",
    whiteSpace: "nowrap",
    borderRight: columnDivider,
  };

  const bodyCellWithDividerSx: SxProps<Theme> = {
    fontSize: 13,
    color: "#1D1F2C",
    whiteSpace: "nowrap",
    py: 1.25,
    borderRight: columnDivider,
  };

  const stickyLeftSx: SxProps<Theme> = {
    position: "sticky",
    left: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    minWidth: 340,
    boxShadow: "8px 0 8px -10px rgba(15, 23, 42, 0.10)",
  };

  const stickyLeftHeaderSx: SxProps<Theme> = {
    ...stickyLeftSx,
    backgroundColor: "#F4F6FF",
    zIndex: 3,
  };

  if (isError) {
    return (
      <Typography color="error">
        {errorMessage ?? t("workHours.list.error")}
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (employeeIds.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("workHours.list.emptyWeek")}
      </Typography>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{ border: "none", backgroundColor: "#fff", ...sx }}
    >
      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: "#fff",
          overflowX: "auto",
        }}
      >
        <Table size="small" sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F4F6FF" }}>
              <TableCell
                sx={{ ...headerCellWithDividerSx, ...stickyLeftHeaderSx }}
              >
                {t("workHours.list.employee")}
              </TableCell>
              {weekDays.map((d) => (
                <TableCell
                  key={d.iso}
                  align="center"
                  sx={headerCellWithDividerSx}
                >
                  {d.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={headerCellWithDividerSx}>
                {t("workHours.list.total")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employeeIds.map((empId) => {
              const emp = employeesById.get(empId) ?? null;
              const dayMap = minutesByEmpByDay.get(empId) ?? new Map();
              const rowTotal = weekDays.reduce(
                (sum, d) => sum + (dayMap.get(d.iso) ?? 0),
                0,
              );
              const sites = Array.from(sitesByEmp.get(empId) ?? []);
              const sitesLabel = formatSitesLabel(sites);

              return (
                <TableRow
                  key={empId}
                  sx={{ "& td": { borderBottom: "1px solid #EEF2FF" } }}
                >
                  <TableCell sx={{ ...bodyCellWithDividerSx, ...stickyLeftSx }}>
                    <Box sx={{ display: "flex", gap: 1.25 }}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
                        {getEmployeeInitials(emp)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {getEmployeeLabel({ ...emp, id: empId })}
                        </Typography>
                        {emp?.jobPosition?.name && (
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#6B7280",
                            }}
                            noWrap
                          >
                            {emp.jobPosition.name}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <ApartmentIcon
                            sx={{ fontSize: 14, color: "#F59E0B" }}
                          />
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#6B7280",
                            }}
                            noWrap
                          >
                            {sitesLabel}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  {weekDays.map((d) => {
                    const mins = dayMap.get(d.iso) ?? 0;
                    return (
                      <TableCell
                        key={d.iso}
                        align="center"
                        sx={bodyCellWithDividerSx}
                      >
                        {mins > 0 ? (
                          <Chip
                            size="small"
                            label={formatMinutesToHHMM(mins)}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              borderRadius: 1,
                              minWidth: 64,
                              backgroundColor: "#FFF7E6",
                              borderColor: "#F1B103",
                              color: "#A16207",
                            }}
                          />
                        ) : (
                          <Typography sx={{ color: "#CBD5E1" }}>—</Typography>
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatMinutesToHHMM(rowTotal)}
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow>
              <TableCell
                sx={{
                  ...bodyCellWithDividerSx,
                  ...stickyLeftSx,
                  fontWeight: 600,
                }}
              >
                {t("workHours.list.total")}
              </TableCell>
              {weekDays.map((d) => (
                <TableCell
                  key={d.iso}
                  align="center"
                  sx={{ ...bodyCellWithDividerSx, fontWeight: 600 }}
                >
                  {formatMinutesToHHMM(totals.perDay.get(d.iso) ?? 0)}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {formatMinutesToHHMM(totals.grand)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
