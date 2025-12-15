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
import { StatCard } from "../../../components/ui/StatCard";
import { useTranslation } from "react-i18next";

type Filter = "sites" | "employees" | "tools" | "vehicles";

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

function monthIndexFromISO(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.getMonth() : null;
}

function toLocal(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.toLocaleString() : "—";
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const year = 2025;

  const { rows } = useConstructionSites();
  const sites = Array.isArray(rows) ? rows : [];

  const totals = useMemo(() => {
    let employees = 0,
      tools = 0,
      vehicles = 0;
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
    }
    return { sites: sites.length, employees, tools, vehicles };
  }, [sites]);

  const [filter, setFilter] = useState<Filter>("sites");

  const { barData, barSeries, growthY } = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: roman[i],
      value: 0,
    }));

    const inc = (arr: typeof months, idx: number | null) => {
      if (idx === null || idx < 0 || idx > 11) return;
      arr[idx].value += 1;
    };

    const sitesPerMonth = months.map((m) => ({ ...m }));
    const employeesPerMonth = months.map((m) => ({ ...m }));
    const toolsPerMonth = months.map((m) => ({ ...m }));
    const vehiclesPerMonth = months.map((m) => ({ ...m }));

    for (const s of sites) {
      const d = s?.createdDate;
      const js = d ? new Date(d) : null;
      if (js && js.getFullYear() === year) inc(sitesPerMonth, js.getMonth());

      (s?.constructionSiteEmployees ?? []).forEach((e: any) => {
        const idx = monthIndexFromISO(e?.dateFrom);
        const y = e?.dateFrom ? new Date(e.dateFrom).getFullYear() : null;
        if (idx !== null && y === year) inc(employeesPerMonth, idx);
      });

      (s?.constructionSiteTools ?? []).forEach((tTool: any) => {
        const idx = monthIndexFromISO(tTool?.purchaseDate);
        const y = tTool?.purchaseDate
          ? new Date(tTool.purchaseDate).getFullYear()
          : null;
        if (idx !== null && y === year) inc(toolsPerMonth, idx);
      });

      (s?.constructionSiteVehicles ?? []).forEach((v: any) => {
        const idx = monthIndexFromISO(v?.purchaseDate);
        const y = v?.purchaseDate
          ? new Date(v.purchaseDate).getFullYear()
          : null;
        if (idx !== null && y === year) inc(vehiclesPerMonth, idx);
      });
    }

    const series = [
      {
        dataKey: "value",
        label: t("dashboard.admin.bar.yAxis"),
        color: theme.palette.primary.main,
      },
    ];

    const now = new Date();
    const lastMonthIndex = now.getFullYear() === year ? now.getMonth() : 11;
    const cumulative: number[] = [];
    let running = 0;
    for (let i = 0; i <= lastMonthIndex; i++) {
      running += sitesPerMonth[i].value;
      cumulative.push(running);
    }

    return {
      barData: {
        sites: sitesPerMonth,
        employees: employeesPerMonth,
        tools: toolsPerMonth,
        vehicles: vehiclesPerMonth,
      },
      barSeries: series,
      growthY: cumulative,
    };
  }, [sites, theme.palette.primary.main, t]);

  const currentBarData =
    filter === "sites"
      ? barData.sites
      : filter === "employees"
      ? barData.employees
      : filter === "tools"
      ? barData.tools
      : barData.vehicles;

  const recentSites = useMemo(() => sites.slice(-5).reverse(), [sites]);

  const barTitle =
    filter === "sites"
      ? t("dashboard.admin.bar.sites", { year })
      : filter === "employees"
      ? t("dashboard.admin.bar.employees", { year })
      : filter === "tools"
      ? t("dashboard.admin.bar.tools", { year })
      : t("dashboard.admin.bar.vehicles", { year });

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        {t("dashboard.admin.title")}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1 }}>
        <StatCard
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(25% - 12px)",
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
              md: "calc(25% - 12px)",
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
              md: "calc(25% - 12px)",
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
              md: "calc(25% - 12px)",
            },
            flexGrow: 1,
          }}
          label={t("dashboard.admin.stats.vehicles")}
          value={totals.vehicles}
          onClick={() => setFilter("vehicles")}
          selected={filter === "vehicles"}
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
            sx={{ width: "100%" }}
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
            xAxis={[
              {
                scaleType: "point",
                data: useMemo(() => {
                  const now = new Date();
                  const lastIdx =
                    now.getFullYear() === year ? now.getMonth() : 11;
                  return [...roman.slice(0, lastIdx + 1)];
                }, []),
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
                <TableCell>
                  {t("dashboard.admin.recent.table.created")}
                </TableCell>
                <TableCell>{t("dashboard.admin.recent.table.range")}</TableCell>
                <TableCell align="right">
                  {t("dashboard.admin.recent.table.resources")}
                </TableCell>
                <TableCell>
                  {t("dashboard.admin.recent.table.status")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentSites.map((s: any) => {
                const emp = (s?.constructionSiteEmployees ?? []).length;
                const tools = (s?.constructionSiteTools ?? []).length;
                const veh = (s?.constructionSiteVehicles ?? []).length;

                // Simple status: if plannedEndDate < today → Past, else Active
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
                    <TableCell>{toLocal(s.createdDate)}</TableCell>
                    <TableCell>
                      {toLocal(s.startDate)} → {toLocal(s.plannedEndDate)}
                    </TableCell>
                    <TableCell align="right">
                      {emp} / {tools} / {veh}
                    </TableCell>
                    <TableCell>
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
