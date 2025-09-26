import { useMemo } from "react";
import { getMonthIndex, monthLabelsHR } from "../../../lib/date";
import type { Tenant } from "../../administration/tenants";

export function useTenantStats(tenants: Tenant[], now = new Date()) {
  const currentYear = now.getFullYear();

  const isActive = (t?: { isActive?: boolean }) => t?.isActive === true;
  const isInactive = (t?: { isActive?: boolean }) => t?.isActive === false;
  const parseDate = (iso?: string) => {
    const d = iso ? new Date(iso) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  };

  const totals = useMemo(() => {
    const total = tenants.length;
    const activeCnt = tenants.filter(isActive).length;
    const inactiveCnt = tenants.filter(isInactive).length;
    const expiredCnt = tenants.filter((t) => {
      const d = parseDate(t.validUpToDate);
      return d ? d < now : false;
    }).length;
    return {
      total,
      active: activeCnt,
      inactive: inactiveCnt,
      expired: expiredCnt,
    };
  }, [tenants, now]);

  const dataset = useMemo(() => {
    const rows = monthLabelsHR.map((month) => ({
      month,
      total: 0,
      active: 0,
      inactive: 0,
      expired: 0,
    }));
    for (const t of tenants) {
      const d = parseDate(t.validUpToDate);
      if (!d || d.getFullYear() !== currentYear) continue;
      const m = getMonthIndex(d);
      rows[m].total += 1;
      if (isActive(t)) rows[m].active += 1;
      if (isInactive(t)) rows[m].inactive += 1;
      if (d < now) rows[m].expired += 1;
    }
    return rows;
  }, [tenants, now, currentYear]);

  return { monthLabels: monthLabelsHR, totals, dataset, currentYear };
}
