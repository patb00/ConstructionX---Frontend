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
import type { SxProps, Theme } from "@mui/material/styles";
import ApartmentIcon from "@mui/icons-material/Apartment";

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

function minutesToHHMM(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function getMinutes(r: WorkLogRow) {
  if (typeof r.totalWorkMinutes === "number") return r.totalWorkMinutes;
  const h = typeof r.hours === "number" ? r.hours : 0;
  const m = typeof r.minutes === "number" ? r.minutes : 0;
  const s = typeof r.seconds === "number" ? r.seconds : 0;
  return h * 60 + m + (s ? Math.round(s / 60) : 0);
}

function initialsFromEmployee(e?: EmployeeRow | null) {
  const fn = (e?.firstName ?? "").trim();
  const ln = (e?.lastName ?? "").trim();
  return `${fn[0] ?? ""}${ln[0] ?? ""}`.toUpperCase() || "?";
}

function labelFromEmployee(e?: EmployeeRow | null, fallbackId?: number) {
  const fn = (e?.firstName ?? "").trim();
  const ln = (e?.lastName ?? "").trim();
  const full = [fn, ln].filter(Boolean).join(" ");
  return full || (fallbackId != null ? `#${fallbackId}` : "—");
}

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
  const { employeeIds, minutesByEmpByDay, sitesByEmp, totals } = useMemo(() => {
    const minutesByEmpByDay = new Map<number, Map<string, number>>();
    const sitesByEmp = new Map<number, Set<string>>();
    const employeeIds = new Set<number>();

    rows.forEach((r) => {
      const empId = Number(r.employeeId);
      if (!Number.isFinite(empId)) return;
      employeeIds.add(empId);

      const dayIso = r.workDate;
      const mins = getMinutes(r);

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
    return <Typography color="error">{errorMessage ?? "Error"}</Typography>;
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
        No work logs for this week.
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
                Employee
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
                Total
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
              const sitesLabel =
                sites.length === 0
                  ? "—"
                  : sites.length <= 2
                    ? sites.join(" · ")
                    : `${sites.slice(0, 2).join(" · ")} +${sites.length - 2}`;

              return (
                <TableRow
                  key={empId}
                  sx={{ "& td": { borderBottom: "1px solid #EEF2FF" } }}
                >
                  <TableCell sx={{ ...bodyCellWithDividerSx, ...stickyLeftSx }}>
                    <Box sx={{ display: "flex", gap: 1.25 }}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: 14 }}>
                        {initialsFromEmployee(emp)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {labelFromEmployee(emp, empId)}
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
                            label={minutesToHHMM(mins)}
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
                    {minutesToHHMM(rowTotal)}
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
                Total
              </TableCell>
              {weekDays.map((d) => (
                <TableCell
                  key={d.iso}
                  align="center"
                  sx={{ ...bodyCellWithDividerSx, fontWeight: 600 }}
                >
                  {minutesToHHMM(totals.perDay.get(d.iso) ?? 0)}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {minutesToHHMM(totals.grand)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
