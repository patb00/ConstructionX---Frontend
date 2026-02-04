import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCondo } from "../../../condos/hooks/useCondo";
import { useEmployees } from "../../../administration/employees/hooks/useEmployees";
import { useAssignEmployeesToCondo } from "../../../condos/hooks/useAssignEmployeesToCondo";
import {
  ReusableAssignDialog,
  type AssignBaseWindow,
  type AssignRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";
import { todayStr } from "../../utils/dates";
import type { AssignEmployeesToCondoRequest } from "../../../condos";

type Props = {
  condoId: number;
  open: boolean;
  onClose: () => void;
};

type EmployeeRow = {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
};

type CondoEmployee = {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
};

type CondoEmployeeWindow = AssignBaseWindow;

export default function AssignEmployeesToCondoDialog({
  condoId,
  open,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const { data: condo } = useCondo(condoId);
  const { employeeRows = [], isLoading, isError } = useEmployees();

  const assign = useAssignEmployeesToCondo();

  const preselected = useMemo(() => {
    const prior = ((condo as any)?.employees ?? []) as CondoEmployee[];

    const ids: number[] = [];
    const map: Record<number, AssignRange<CondoEmployeeWindow>> = {};

    for (const e of prior) {
      const id = Number((e as any)?.id);
      if (!Number.isFinite(id)) continue;

      ids.push(id);
      map[id] = {
        windows: [
          {
            from: e.dateFrom ?? todayStr(),
            to: e.dateTo ?? todayStr(),
            custom: true,
          },
        ],
      };
    }

    return { ids, map };
  }, [condo]);

  return (
    <ReusableAssignDialog<
      EmployeeRow,
      CondoEmployeeWindow,
      AssignEmployeesToCondoRequest
    >
      open={open}
      title={t("condos.assignEmployees.title")}
      onClose={() => {
        if (assign.isPending) return;
        onClose();
      }}
      items={employeeRows}
      loading={isLoading}
      error={isError}
      emptyText={t("condos.assignEmployees.empty")}
      loadErrorText={t("common.loadError")}
      busy={assign.isPending}
      preselected={preselected}
      allowMultipleWindows={false}
      detailGridMd="minmax(140px,1fr) 180px 180px"
      getItemId={(e) => Number(e.id)}
      getItemPrimary={(e) => `${e.firstName} ${e.lastName}`.trim()}
      getItemSecondary={(e) => e.jobPositionName ?? null}
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
        pickHint: t("condos.assignEmployees.pickHint"),
        itemsCountLabel: (count: number) =>
          t("condos.assignEmployees.allCount", { count }),
        selectedCountLabel: (count: number) =>
          t("condos.assignEmployees.selectedCount", { count }),
        chipGlobal: t("constructionSites.assign.chip.global"),
        chipCustom: t("constructionSites.assign.chip.custom"),
        resetToGlobalTooltip: t(
          "constructionSites.assign.tooltip.resetToGlobal"
        ),
      }}
      buildPayload={({ selected, ranges, globalFrom, globalTo }) => ({
        condoId,
        employees: selected.map((employeeId) => {
          const window =
            ranges[employeeId]?.windows?.[0] ??
            ({ from: globalFrom, to: globalTo } as CondoEmployeeWindow);
          return {
            employeeId,
            dateFrom: window.from,
            dateTo: window.to,
          };
        }),
      })}
      onSave={(payload) =>
        assign.mutate(payload, {
          onSuccess: () => onClose(),
        })
      }
    />
  );
}
