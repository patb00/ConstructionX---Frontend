import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useConstructionSites } from "../../construction_site/hooks/useConstructionSites";
import { StatCard } from "../../../components/ui/stats/StatCard";
import { useTranslation } from "react-i18next";
import { monthIndexFromISO } from "../utils/date";

type Filter = "sites" | "employees" | "tools" | "vehicles" | "condos";

const roman = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

function getEmployeeEmploymentISO(e: any): string | null {
  const dz =
    e?.datumZaposljenja ??
    e?.datum_zaposljenja ??
    e?.employmentDate ??
    e?.dateOfEmployment;

  if (typeof dz === "string" && dz.trim()) return dz;

  const aw0 = Array.isArray(e?.assignmentWindows)
    ? e.assignmentWindows[0]
    : null;
  const df = aw0?.dateFrom;
  if (typeof df === "string" && df.trim()) return df;

  return null;
}

function toEUDate(value: any, withTime = false): string {
  if (!value) return "—";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "—";

  const opts: Intl.DateTimeFormatOptions = withTime
    ? {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : { day: "2-digit", month: "2-digit", year: "numeric" };

  // hr-HR gives EU format (dd.mm.yyyy)
  return new Intl.DateTimeFormat("hr-HR", opts).format(d);
}

function getYearFromISO(iso?: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.getFullYear() : null;
}

function getCondoStartISO(c: any): string | null {
  const iso = c?.dateFrom ?? c?.leaseStartDate ?? null;
  return typeof iso === "string" && iso.trim() ? iso : null;
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const year = 2026;

  const { constructionSitesRows } = useConstructionSites({
    statusOptions: [],
    employeeOptions: [],
    toolOptions: [],
    vehicleOptions: [],
  });

  const sites = Array.isArray(constructionSitesRows)
    ? constructionSitesRows
    : [];

  const totals = useMemo(() => {
    let employees = 0,
      tools = 0,
      vehicles = 0,
      condos = 0;

    for (const s of sites) {
      employees += Array.isArray(s.constructionSiteEmployees)
        ? s.constructionSiteEmployees.length
        : 0;
      tools += Array.isArray(s.constructionSiteTools)
        ? s.constructionSiteTools.length
        : 0;
      vehicles += Array.isArray(s.constructionSiteVehicles)
        ? s.constructionSiteVehicles.length
        : 0;
      condos += Array.isArray(s.constructionSiteCondos)
        ? s.constructionSiteCondos.length
        : 0;
    }
    return { sites: sites.length, employees, tools, vehicles, condos };
  }, [sites]);

  const [filter, setFilter] = useState<Filter>("sites");

  const { barData, barSeries, growthY, lineMonths } = useMemo(() => {
    const baseMonths = Array.from({ length: 12 }, (_, i) => ({
      month: roman[i],
      value: 0,
    }));

    const inc = (arr: typeof baseMonths, idx: number | null) => {
      if (idx === null || idx < 0 || idx > 11) return;
      arr[idx].value += 1;
    };

    const sitesPerMonth = baseMonths.map((m) => ({ ...m }));
    const employeesPerMonth = baseMonths.map((m) => ({ ...m }));
    const toolsPerMonth = baseMonths.map((m) => ({ ...m }));
    const vehiclesPerMonth = baseMonths.map((m) => ({ ...m }));
    const condosPerMonth = baseMonths.map((m) => ({ ...m }));

    for (const s of sites) {
      // sites by startDate
      const siteStartISO: string | null = s?.startDate ?? null;
      const js = siteStartISO ? new Date(siteStartISO) : null;
      if (js && Number.isFinite(js.getTime()) && js.getFullYear() === year) {
        inc(sitesPerMonth, js.getMonth());
      }

      // employees by datum zaposljenja (fallback to assignmentWindows[0].dateFrom)
      (s?.constructionSiteEmployees ?? []).forEach((e: any) => {
        const empISO = getEmployeeEmploymentISO(e);
        const idx = monthIndexFromISO(empISO);
        const y = getYearFromISO(empISO);
        if (idx !== null && y === year) inc(employeesPerMonth, idx);
      });

      // tools by purchaseDate
      (s?.constructionSiteTools ?? []).forEach((tool: any) => {
        const iso = tool?.purchaseDate ?? null;
        const idx = monthIndexFromISO(iso);
        const y = getYearFromISO(iso);
        if (idx !== null && y === year) inc(toolsPerMonth, idx);
      });

      // vehicles by purchaseDate
      (s?.constructionSiteVehicles ?? []).forEach((v: any) => {
        const iso = v?.purchaseDate ?? null;
        const idx = monthIndexFromISO(iso);
        const y = getYearFromISO(iso);
        if (idx !== null && y === year) inc(vehiclesPerMonth, idx);
      });

      // condos by condo.dateFrom (fallback to leaseStartDate)
      (s?.constructionSiteCondos ?? []).forEach((c: any) => {
        const iso = getCondoStartISO(c);
        const idx = monthIndexFromISO(iso);
        const y = getYearFromISO(iso);
        if (idx !== null && y === year) inc(condosPerMonth, idx);
      });
    }

    const series = [
      {
        dataKey: "value",
        label: t("dashboard.admin.bar.yAxis"),
        color: theme.palette.primary.main,

        barLabel: (item: any) => (item.value ? String(item.value) : ""),
      },
    ];

    // line chart: cumulative sites (same behavior as before)
    let lastIdx = 11;
    for (let i = 11; i >= 0; i--) {
      if (sitesPerMonth[i].value > 0) {
        lastIdx = i;
        break;
      }
    }

    const lineMonths = roman.slice(0, lastIdx + 1);

    const cumulative: number[] = [];
    let running = 0;
    for (let i = 0; i <= lastIdx; i++) {
      running += sitesPerMonth[i].value;
      cumulative.push(running);
    }

    return {
      barData: {
        sites: sitesPerMonth,
        employees: employeesPerMonth,
        tools: toolsPerMonth,
        vehicles: vehiclesPerMonth,
        condos: condosPerMonth,
      },
      barSeries: series,
      growthY: cumulative,
      lineMonths,
    };
  }, [sites, theme.palette.primary.main, t, year]);

  const currentBarData =
    filter === "sites"
      ? barData.sites
      : filter === "employees"
        ? barData.employees
        : filter === "tools"
          ? barData.tools
          : filter === "vehicles"
            ? barData.vehicles
            : barData.condos;

  const recentSites = useMemo(() => {
    const withAnyResources = [...sites].filter(
      (s: any) =>
        (s?.constructionSiteEmployees?.length ?? 0) > 0 ||
        (s?.constructionSiteTools?.length ?? 0) > 0 ||
        (s?.constructionSiteVehicles?.length ?? 0) > 0,
    );

    return withAnyResources
      .sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0))
      .slice(0, 5);
  }, [sites]);

  const barTitle =
    filter === "sites"
      ? t("dashboard.admin.bar.sites", { year })
      : filter === "employees"
        ? t("dashboard.admin.bar.employees", { year })
        : filter === "tools"
          ? t("dashboard.admin.bar.tools", { year })
          : filter === "vehicles"
            ? t("dashboard.admin.bar.vehicles", { year })
            : t("dashboard.admin.bar.condos", { year });

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        {t("dashboard.admin.title")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(5, 1fr)",
          },
          gap: 2,
          mb: 1,
        }}
      >
        <StatCard
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(20% - 12px)",
            },
            flexGrow: 1,
          }}
          label={t("dashboard.admin.stats.sites")}
          value={totals.sites}
          onClick={() => setFilter("sites")}
          selected={filter === "sites"}
        />
        <StatCard
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(20% - 12px)",
            },
            flexGrow: 1,
          }}
          label={t("dashboard.admin.stats.employees")}
          value={totals.employees}
          onClick={() => setFilter("employees")}
          selected={filter === "employees"}
        />
        <StatCard
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(20% - 12px)",
            },
            flexGrow: 1,
          }}
          label={t("dashboard.admin.stats.tools")}
          value={totals.tools}
          onClick={() => setFilter("tools")}
          selected={filter === "tools"}
        />
        <StatCard
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(20% - 12px)",
            },
            flexGrow: 1,
          }}
          label={t("dashboard.admin.stats.vehicles")}
          value={totals.vehicles}
          onClick={() => setFilter("vehicles")}
          selected={filter === "vehicles"}
        />

        {/* ✅ NEW: condos card */}
        <StatCard
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(20% - 12px)",
            },
            flexGrow: 1,
          }}
          label={t("dashboard.admin.stats.condos")}
          value={totals.condos}
          onClick={() => setFilter("condos")}
          selected={filter === "condos"}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
          width: "100%",
        }}
      >
        <Card
          elevation={3}
          sx={{
            flexBasis: { md: "70%" },
            flexGrow: 1,
            p: 2,
            overflow: "visible",
            height: { xs: 300, md: 380 },
          }}
        >
          <CardHeader
            titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
            title={barTitle}
            sx={{ p: 0, mb: 1 }}
          />
          <Divider sx={{ mb: 1 }} />
          <BarChart
            dataset={currentBarData}
            xAxis={[{ dataKey: "month" }]}
            series={barSeries as any}
            yAxis={[{ min: 0, label: t("dashboard.admin.bar.yAxis") }]}
            height={isXs ? 240 : 300}
            margin={
              isXs
                ? { left: 40, right: 10, top: 10, bottom: 50 }
                : { left: 60, right: 20, top: 20, bottom: 40 }
            }
            sx={{
              width: "100%",
              "& .MuiChartsBarLabel-root": {
                fontSize: 12,
                fontWeight: 600,
              },
            }}
          />
        </Card>

        <Card
          elevation={3}
          sx={{
            flexBasis: { md: "30%" },
            flexGrow: 1,
            p: 2,
            overflow: "visible",
            height: { xs: 300, md: 380 },
          }}
        >
          <CardHeader
            titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
            title={t("dashboard.admin.line.title", { year })}
            sx={{ p: 0, mb: 1 }}
          />
          <Divider sx={{ mb: 1 }} />
          <LineChart
            xAxis={[{ scaleType: "point", data: lineMonths }]}
            yAxis={[
              {
                label: "",
                tickLabelStyle: { display: "none" },
              },
            ]}
            series={[
              {
                data: growthY,
                label: t("dashboard.admin.line.cumulative"),
                color: "#5D2BFF",
                curve: "linear",
              },
            ]}
            height={isXs ? 240 : 300}
            margin={
              isXs
                ? { top: 10, right: 10, bottom: 30, left: 30 }
                : { top: 10, right: 20, bottom: 40, left: 40 }
            }
            sx={{ width: "100%" }}
          />
        </Card>
      </Box>

      <Card elevation={3} sx={{ mt: 2, p: 2 }}>
        <CardHeader
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
          title={t("dashboard.admin.recent.title")}
          sx={{ p: 0, mb: 1 }}
        />
        <Divider sx={{ mb: 2 }} />
        <TableContainer sx={{ borderRadius: 1, overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              "& th": {
                fontWeight: 600,
                color: "text.secondary",
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                whiteSpace: "nowrap",
              },
              "& td": {
                borderBottom: (t) => `1px dashed ${t.palette.divider}`,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("dashboard.admin.recent.table.site")}</TableCell>
                <TableCell>
                  {t("dashboard.admin.recent.table.location")}
                </TableCell>

                {/* ✅ centered headers */}
                <TableCell align="center">
                  {t("dashboard.admin.recent.table.created")}
                </TableCell>
                <TableCell align="center">
                  {t("dashboard.admin.recent.table.range")}
                </TableCell>
                <TableCell align="center">
                  {t("dashboard.admin.recent.table.resources")}
                </TableCell>
                <TableCell align="center">
                  {t("dashboard.admin.recent.table.status")}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentSites.map((s: any) => {
                const emp = (s?.constructionSiteEmployees ?? []).length;
                const tools = (s?.constructionSiteTools ?? []).length;
                const veh = (s?.constructionSiteVehicles ?? []).length;

                const today = new Date();
                const plannedEnd = s?.plannedEndDate
                  ? new Date(s.plannedEndDate)
                  : null;
                const isActive = !(plannedEnd && plannedEnd < today);

                const chip = isActive
                  ? {
                      label: t("dashboard.admin.statusChip.active"),
                      color: "success" as const,
                    }
                  : {
                      label: t("dashboard.admin.statusChip.past"),
                      color: "default" as const,
                    };

                return (
                  <TableRow key={s.id ?? s.name} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {s.name ?? "—"}
                    </TableCell>
                    <TableCell>{s.location ?? "—"}</TableCell>

                    {/* ✅ EU date + centered cells */}
                    <TableCell align="center">
                      {toEUDate(s.createdDate, true)}
                    </TableCell>
                    <TableCell align="center">
                      {toEUDate(s.startDate)} → {toEUDate(s.plannedEndDate)}
                    </TableCell>
                    <TableCell align="center">
                      {emp} / {tools} / {veh}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={chip.label}
                        color={chip.color}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
