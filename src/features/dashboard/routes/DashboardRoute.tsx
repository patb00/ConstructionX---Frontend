import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTenants } from "../../administration/tenants/hooks/useTenants";
import type { Tenant } from "../../administration/tenants";
import { StatsRow } from "../components/StatsRows";
import { TenantsYearChart } from "../components/TenantsYearChart";
import { useTenantStats } from "../hooks/useTenantsStats";

import { ForceChangePasswordDialog } from "../components/ForceChangePasswordDialog";
import { useAuthStore } from "../../auth/store/useAuthStore";

type Filter = "all" | "active" | "inactive" | "expired";

export default function DashboardRoute() {
  const { tenantsRows } = useTenants();
  const tenants: Tenant[] = Array.isArray(tenantsRows) ? tenantsRows : [];
  const { totals, dataset, currentYear } = useTenantStats(tenants);
  const [filter, setFilter] = useState<Filter>("all");

  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);
  const clearAuth = useAuthStore((s) => s.clear);

  return (
    <Stack spacing={3} sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }} />
      <StatsRow
        totals={totals}
        onSelectTotal={() => setFilter("all")}
        onSelectActive={() => setFilter("active")}
        onSelectInactive={() => setFilter("inactive")}
        onSelectExpired={() => setFilter("expired")}
        selected={filter}
      />
      <TenantsYearChart
        dataset={dataset}
        currentYear={currentYear}
        filter={filter}
      />

      <ForceChangePasswordDialog
        open={mustChangePassword}
        onDone={() => {
          // nothing else needed; dialog closes itself via store flag
        }}
        onLogout={() => {
          clearAuth();
          // optionally hard redirect to /login
          window.location.href = "/login";
        }}
      />
    </Stack>
  );
}
