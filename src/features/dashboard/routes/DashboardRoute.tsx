"use client";

import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTenants } from "../../administration/tenants/hooks/useTenants";
import type { Tenant } from "../../administration/tenants";
import { StatsRow } from "../components/StatsRows";
import { TenantsYearChart } from "../components/TenantsYearChart";
import { useTenantStats } from "../hooks/useTenantsStats";
import { QueryBoundary } from "../../../components/ui/feedback/QueryBoundary";
import { FullScreenError } from "../../../components/ui/feedback/PageStates";

type Filter = "all" | "active" | "inactive" | "expired";

export default function DashboardRoute() {
  const { tenantsRows, error, isLoading } = useTenants();
  const tenants: Tenant[] = Array.isArray(tenantsRows) ? tenantsRows : [];
  const { totals, dataset, currentYear } = useTenantStats(tenants);
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <QueryBoundary
      isLoading={isLoading}
      error={error}
      fallbackError={<FullScreenError title="Nadzorna ploča" />}
    >
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
      </Stack>
    </QueryBoundary>
  );
}
