import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ReusableAssignDialog,
  type AssignBaseWindow,
  type AssignRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";
import { useConstructionSite } from "../../hooks/useConstructionSite";
import { useEmployees } from "../../../administration/employees/hooks/useEmployees";
import { useAssignEmployeesToConstructionSite } from "../../hooks/useAssignEmployeesToConstructionSite";
import { todayStr } from "../../utils/dates";

type EmpWindow = AssignBaseWindow;

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

  const preselected = useMemo(() => {
    const prior = (site as any)?.constructionSiteEmployees as
      | Array<{
          id?: number;
          employeeId?: number;
          employee?: { id?: number } | null;
          firstName?: string;
          lastName?: string;
          dateFrom?: string;
          dateTo?: string;
          assignmentWindows?: Array<{ dateFrom?: string; dateTo?: string }>;
        }>
      | undefined;

    const ids: number[] = [];
    const map: Record<number, AssignRange<EmpWindow>> = {};

    if (!prior?.length || !employeeRows.length) return { ids, map };

    const existingIds = new Set(
      employeeRows
        .map((employee: any) => Number(employee?.id))
        .filter((id) => Number.isFinite(id))
    );
    const byName = new Map(
      employeeRows.map((employee: any) => [
        `${employee?.firstName ?? ""} ${employee?.lastName ?? ""}`
          .trim()
          .toLowerCase(),
        Number(employee?.id),
      ])
    );

    const bucket = new Map<number, EmpWindow[]>();

    for (const item of prior) {
      let id = Number(item?.employeeId ?? item?.employee?.id ?? item?.id);
      if (!Number.isFinite(id)) {
        const name = `${item?.firstName ?? ""} ${item?.lastName ?? ""}`
          .trim()
          .toLowerCase();
        const mapped = byName.get(name);
        if (Number.isFinite(Number(mapped))) {
          id = Number(mapped);
        }
      }
      if (!Number.isFinite(id)) continue;
      if (!bucket.has(id)) bucket.set(id, []);

      const windows =
        item?.assignmentWindows && item.assignmentWindows.length > 0
          ? item.assignmentWindows
          : [
              {
                dateFrom: item?.dateFrom ?? todayStr(),
                dateTo: item?.dateTo ?? todayStr(),
              },
            ];

      windows.forEach((window) => {
        bucket.get(id)!.push({
          from: window?.dateFrom ?? todayStr(),
          to: window?.dateTo ?? todayStr(),
          custom: true,
        });
      });
    }

    for (const [id, windows] of bucket.entries()) {
      if (!existingIds.has(id)) continue;
      ids.push(id);
      map[id] = { windows };
    }

    return { ids, map };
  }, [site, employeeRows]);

  const initialGlobalRange = useMemo(() => {
    if (preselected.ids.length === 0) return null;
    const first = preselected.map[preselected.ids[0]];
    if (!first || first.windows.length !== 1) return null;
    const { from, to } = first.windows[0];
    const allSame = preselected.ids.every((id) => {
      const range = preselected.map[id];
      return (
        range?.windows.length === 1 &&
        range.windows[0].from === from &&
        range.windows[0].to === to
      );
    });
    return allSame ? { from, to } : null;
  }, [preselected]);

  return (
    <ReusableAssignDialog<any, EmpWindow, any>
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
      detailGridMd="minmax(140px,1fr) 180px 180px"
      getItemId={(e) => Number(e.id)}
      getItemPrimary={(e) =>
        `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || `ID ${e.id}`
      }
      getItemSecondary={(e) => (e.oib ? `OIB: ${e.oib}` : null)}
      createWindow={({ globalFrom, globalTo }) => ({
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
                const windows =
                  ranges[employeeId]?.windows ??
                  ([{ from: globalFrom, to: globalTo }] as EmpWindow[]);

                return {
                  employeeId,
                  assignmentWindows: windows.map((window) => ({
                    dateFrom: window.from,
                    dateTo: window.to,
                  })),
                };
              }),
      })}
      onSave={(payload) => assign.mutate(payload, { onSuccess: onClose })}
    />
  );
}
