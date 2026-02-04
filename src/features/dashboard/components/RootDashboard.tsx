import {
  Box,
  Stack,
  Typography,
  Card,
  CardHeader,
  Divider,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useTenants } from "../../administration/tenants/hooks/useTenants";
import type { Tenant } from "../../administration/tenants";
import { StatsRow } from "../../../components/ui/stats/StatsRows";
import { useTenantStats } from "../hooks/useTenantsStats";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslation } from "react-i18next";
import { endOfMonth, statusOnDate } from "../utils/date";

type Filter = "all" | "active" | "inactive" | "expired";

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

export default function RootDashboard() {
  const { t } = useTranslation();
  const { tenantsRows } = useTenants();
  const tenants: Tenant[] = Array.isArray(tenantsRows) ? tenantsRows : [];
  const { totals } = useTenantStats(tenants);
  const [filter, setFilter] = useState<Filter>("all");

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const { barData, barSeries, growthX, growthY, year } = useMemo(() => {
    const now = new Date();
    const year = 2025;
    const months = Array.from({ length: 12 }, (_, i) => i);

    const monthlyCounts = months.map((m) => {
      const at = endOfMonth(year, m);
      let active = 0,
        inactive = 0,
        expired = 0;
      tenants.forEach((tnt) => {
        const s = statusOnDate(tnt, at);
        if (s === "active") active += 1;
        else if (s === "inactive") inactive += 1;
        else expired += 1;
      });
      return { month: roman[m], active, inactive, expired };
    });

    const barSeriesAll = [
      {
        dataKey: "active",
        label: t("dashboard.root.bar.series.active"),
        color: theme.palette.success.main,
      },
      {
        dataKey: "inactive",
        label: t("dashboard.root.bar.series.inactive"),
        color: theme.palette.warning.main,
      },
      {
        dataKey: "expired",
        label: t("dashboard.root.bar.series.expired"),
        color: theme.palette.error.main,
      },
    ];

    const lastMonthIndex = now.getFullYear() === year ? now.getMonth() : 11;
    const growthX = roman.slice(0, lastMonthIndex + 1);
    const growthY = monthlyCounts
      .slice(0, lastMonthIndex + 1)
      .map((r) => r.active);

    return {
      barData: monthlyCounts,
      barSeries: barSeriesAll,
      growthX,
      growthY,
      year,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tenants,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    t,
  ]);

  const selectedBarSeries = useMemo(() => {
    if (filter === "all") return barSeries as any;
    const map: Record<Exclude<Filter, "all">, number> = {
      active: 0,
      inactive: 1,
      expired: 2,
    } as const;
    const def = barSeries[map[filter]];
    return [def] as any;
  }, [filter, barSeries]);

  const recentTenants = useMemo(() => {
    const list = Array.isArray(tenants) ? tenants : [];
    return list.slice(-5).reverse();
  }, [tenants]);

  const toChip = (s: "active" | "inactive" | "expired") =>
    s === "active"
      ? { label: t("dashboard.root.statusChip.active"), color: "success" }
      : s === "inactive"
      ? { label: t("dashboard.root.statusChip.inactive"), color: "warning" }
      : { label: t("dashboard.root.statusChip.expired"), color: "error" };

  const todayStatus = (tnt: Tenant) => statusOnDate(tnt, new Date());

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        {t("dashboard.root.title")}
      </Typography>

      <StatsRow
        totals={totals}
        onSelectTotal={() => setFilter("all")}
        onSelectActive={() => setFilter("active")}
        onSelectInactive={() => setFilter("inactive")}
        onSelectExpired={() => setFilter("expired")}
        selected={filter}
      />

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
            title={
              filter === "all"
                ? t("dashboard.root.bar.tenantsByStatus", { year })
                : t("dashboard.root.bar.tenantsFiltered", {
                    status:
                      filter === "active"
                        ? t("dashboard.root.bar.series.active")
                        : filter === "inactive"
                        ? t("dashboard.root.bar.series.inactive")
                        : t("dashboard.root.bar.series.expired"),
                    year,
                  })
            }
            sx={{ p: 0, mb: 1 }}
          />
          <Divider sx={{ mb: 1 }} />
          <BarChart
            dataset={barData}
            xAxis={[{ dataKey: "month" }]}
            series={selectedBarSeries}
            yAxis={[{ min: 0, label: t("dashboard.root.bar.yAxisLabel") }]}
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
            title={t("dashboard.root.line.title", { year })}
            sx={{ p: 0, mb: 1 }}
          />
          <Divider sx={{ mb: 1 }} />
          <LineChart
            xAxis={[{ scaleType: "point", data: growthX }]}
            series={[
              { data: growthY, label: t("dashboard.root.line.activeTenants") },
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
          title={t("dashboard.root.recent.title")}
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
                borderBottom: (th) => `1px solid ${th.palette.divider}`,
                whiteSpace: "nowrap",
              },
              "& td": {
                borderBottom: (td) => `1px dashed ${td.palette.divider}`,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("dashboard.root.recent.table.tenant")}</TableCell>
                <TableCell>{t("dashboard.root.recent.table.email")}</TableCell>
                <TableCell>
                  {t("dashboard.root.recent.table.validUntil")}
                </TableCell>
                <TableCell>
                  {t("dashboard.root.recent.table.statusToday")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTenants.map((tnt) => {
                const st = todayStatus(tnt);
                const chip = toChip(st);
                return (
                  <TableRow key={tnt.identifier ?? tnt.name} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{tnt.name}</TableCell>
                    <TableCell>{tnt.email}</TableCell>
                    <TableCell>
                      {tnt.validUpToDate
                        ? new Date(tnt.validUpToDate).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={chip.label}
                        color={chip.color as any}
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
