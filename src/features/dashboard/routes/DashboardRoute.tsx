"use client";

import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTenants } from "../../administration/tenants/hooks/useTenants";
import type { Tenant } from "../../administration/tenants";
import { StatsRow } from "../components/StatsRows";
import { TenantsYearChart } from "../components/TenantsYearChart";
import { useTenantStats } from "../hooks/useTenantsStats";
import { getCurrentUser } from "../../auth/model/currentUser";

type Filter = "all" | "active" | "inactive" | "expired";

export default function DashboardRoute() {
  const { data } = useTenants() as { data?: Tenant[] };
  const tenants = Array.isArray(data) ? data : [];
  const { totals, dataset, currentYear } = useTenantStats(tenants);

  const user = getCurrentUser();
  const displayName =
    (user?.name && user?.surname
      ? `${user.name} ${user.surname}`
      : user?.name || user?.email) ?? "Korisnik";

  const [filter, setFilter] = useState<Filter>("all");

  return (
    <Stack spacing={3} sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
        Dobrodošli,<strong> {displayName}</strong>
      </Typography>

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
  );
}
