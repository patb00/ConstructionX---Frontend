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
import { useState } from "react";
import { useTenants } from "../../administration/tenants/hooks/useTenants";
import type { Tenant } from "../../administration/tenants";
import { StatsRow } from "../components/StatsRows";
import { useTenantStats } from "../hooks/useTenantsStats";
import { ForceChangePasswordDialog } from "../components/ForceChangePasswordDialog";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";

type Filter = "all" | "active" | "inactive" | "expired";

export default function DashboardRoute() {
  const { tenantsRows } = useTenants();
  const tenants: Tenant[] = Array.isArray(tenantsRows) ? tenantsRows : [];
  const { totals } = useTenantStats(tenants);
  const [filter, setFilter] = useState<Filter>("all");

  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);
  const clearAuth = useAuthStore((s) => s.clear);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // ===== Dummy data =====
  const barData = [
    { month: "I", active: 12, inactive: 3, expired: 1 },
    { month: "II", active: 14, inactive: 4, expired: 2 },
    { month: "III", active: 16, inactive: 5, expired: 2 },
    { month: "IV", active: 18, inactive: 4, expired: 1 },
    { month: "V", active: 21, inactive: 6, expired: 2 },
    { month: "VI", active: 20, inactive: 7, expired: 3 },
    { month: "VII", active: 22, inactive: 6, expired: 2 },
    { month: "VIII", active: 25, inactive: 5, expired: 2 },
    { month: "IX", active: 27, inactive: 7, expired: 3 },
    { month: "X", active: 29, inactive: 6, expired: 2 },
    { month: "XI", active: 28, inactive: 7, expired: 3 },
    { month: "XII", active: 31, inactive: 6, expired: 2 },
  ];
  const barSeries = [
    { dataKey: "active", label: "Aktivni", color: theme.palette.success.main },
    {
      dataKey: "inactive",
      label: "Neaktivni",
      color: theme.palette.warning.main,
    },
    { dataKey: "expired", label: "Istekli", color: theme.palette.error.main },
  ];

  const miniTrendX = [
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
  const miniTrendY = [12, 15, 14, 18, 20, 24, 21, 23, 26, 29, 27, 31];

  const tableRows = [
    {
      name: "Acme d.o.o.",
      plan: "Pro",
      users: 24,
      status: "Active",
    },
    {
      name: "Globex d.d.",
      plan: "Basic",
      users: 8,
      status: "Inactive",
    },
    {
      name: "Initech",
      plan: "Pro",
      users: 15,
      status: "Active",
    },
    {
      name: "Umbrella Corp",
      plan: "Pro",
      users: 42,
      status: "Expired",
    },
    {
      name: "Soylent",
      plan: "Basic",
      users: 5,
      status: "Active",
    },
  ];
  const statusColor = (s: string) =>
    s === "Active" ? "success" : s === "Inactive" ? "warning" : "error";

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Nadzorna ploča
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
            title="Tenants by Status (dummy)"
            sx={{ p: 0, mb: 1 }}
          />
          <Divider sx={{ mb: 1 }} />
          <BarChart
            dataset={barData}
            xAxis={[{ dataKey: "month" }]}
            series={barSeries as any}
            yAxis={[{ min: 0, label: "Broj" }]}
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
            title="Monthly Growth (dummy)"
            sx={{ p: 0, mb: 1 }}
          />
          <Divider sx={{ mb: 1 }} />
          <LineChart
            xAxis={[{ scaleType: "point", data: miniTrendX }]}
            series={[{ data: miniTrendY, label: "New tenants" }]}
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
          title="Recent Tenants (dummy)"
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
                <TableCell>Tenant</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell align="right">Users</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((r) => (
                <TableRow key={r.name} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{r.name}</TableCell>
                  <TableCell>{r.plan}</TableCell>
                  <TableCell align="right">{r.users}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={r.status}
                      color={statusColor(r.status) as any}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ForceChangePasswordDialog
        open={mustChangePassword}
        onDone={() => {}}
        onLogout={() => {
          clearAuth();
          window.location.href = "/login";
        }}
      />
    </Stack>
  );
}
