import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useAssignEmployeesToConstructionSite } from "../hooks/useAssignEmployeesToConstructionSite";
import { useConstructionSite } from "../hooks/useConstructionSite";
import { todayStr } from "../utils/dates";
import { fullName } from "../utils/name";
import { getCommonRange } from "../utils/ranges";
import {
  ReusableAssignDialog,
  type AssignBaseRange,
} from "../../../components/ui/assign-dialog/AssignDialog";

type EmpRange = AssignBaseRange;

type Props = {
  constructionSiteId: number;
  open: boolean;
  onClose: () => void;
};

export default function AssignEmployeesDialog({
  constructionSiteId,
  open,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { employeeRows = [], isLoading, isError } = useEmployees();
  const { data: site } = useConstructionSite(constructionSiteId);
  const assign = useAssignEmployeesToConstructionSite();

  // ---------- preselected mapping (same logic as your original) ----------
  const preselected = useMemo(() => {
    type Prior = {
      firstName?: string;
      lastName?: string;
      dateFrom?: string;
      dateTo?: string;
    };

    const prior = (site as any)?.constructionSiteEmployees as
      | Prior[]
      | undefined;

    const ids: number[] = [];
    const map: Record<number, EmpRange> = {};

    if (!prior?.length || !employeeRows.length) return { ids, map };

    const bucket = new Map<string, Array<{ from: string; to: string }>>();
    for (const p of prior) {
      const key = fullName(p.firstName, p.lastName);
      if (!bucket.has(key)) bucket.set(key, []);
      bucket.get(key)!.push({
        from: p.dateFrom ?? todayStr(),
        to: p.dateTo ?? todayStr(),
      });
    }

    for (const e of employeeRows as any[]) {
      const id = Number(e?.id);
      if (!Number.isFinite(id)) continue;

      const key = fullName(e?.firstName, e?.lastName);
      const list = bucket.get(key);

      if (list?.length) {
        const { from, to } = list.shift()!;
        ids.push(id);
        map[id] = { from, to, custom: false };
      }
    }

    return { ids, map };
  }, [site, employeeRows]);

  // Employees dialog had special: set global range based on common range
  const initialGlobalRange = useMemo(() => {
    const common = getCommonRange(preselected.ids, preselected.map);
    return common ? { from: common.from, to: common.to } : null;
  }, [preselected]);

  return (
    <ReusableAssignDialog<any, EmpRange, any>
      open={open}
      title={t("constructionSites.assign.title")}
      onClose={() => {
        if (assign.isPending) return;
        onClose();
      }}
      items={employeeRows as any[]}
      loading={isLoading}
      error={isError}
      emptyText={t("constructionSites.assign.empty")}
      loadErrorText={t("constructionSites.assign.loadError")}
      busy={assign.isPending}
      preselected={preselected}
      initialGlobalRange={initialGlobalRange}
      leftWidthMd="320px"
      detailGridMd="minmax(220px,1fr) 180px 180px 48px"
      getItemId={(e) => Number(e.id)}
      getItemPrimary={(e) =>
        `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || `ID ${e.id}`
      }
      getItemSecondary={(e) => (e.oib ? `OIB: ${e.oib}` : null)}
      createRange={({ globalFrom, globalTo }) => ({
        from: globalFrom,
        to: globalTo,
        custom: false,
      })}
      labels={{
        startLabel: t("constructionSites.assign.global.startLabel"),
        endLabel: t("constructionSites.assign.global.endLabel"),
        cancel: t("constructionSites.assign.actions.cancel"),
        save: t("constructionSites.assign.actions.save"),
        saving: t("constructionSites.assign.actions.saving"),
        invalidRange: t("constructionSites.assign.validation.invalidRange"),
        pickHint: t("constructionSites.assign.pickHint"),
        itemsCountLabel: (count: number) =>
          t("constructionSites.assign.left.employeesCount", { count }),
        selectedCountLabel: (count: number) =>
          t("constructionSites.assign.left.selectedCount", { count }),
        chipGlobal: t("constructionSites.assign.chip.global"),
        chipCustom: t("constructionSites.assign.chip.custom"),
        resetToGlobalTooltip: t(
          "constructionSites.assign.tooltip.resetToGlobal"
        ),
      }}
      buildPayload={({ selected, ranges, globalFrom, globalTo }) => ({
        constructionSiteId,
        employees:
          selected.length === 0
            ? []
            : selected.map((employeeId) => {
                const r =
                  ranges[employeeId] ??
                  ({
                    from: globalFrom,
                    to: globalTo,
                    custom: false,
                  } as EmpRange);

                return {
                  employeeId,
                  dateFrom: r.from,
                  dateTo: r.to,
                };
              }),
      })}
      onSave={(payload) => assign.mutate(payload, { onSuccess: onClose })}
    />
  );
}
