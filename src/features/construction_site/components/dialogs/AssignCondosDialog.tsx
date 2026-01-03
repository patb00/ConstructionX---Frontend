import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useConstructionSite } from "../../hooks/useConstructionSite";
import { useEmployees } from "../../../administration/employees/hooks/useEmployees";
import { useAssignCondosToConstructionSite } from "../../hooks/useAssignCondosToConstructionSite";
import { useCondos } from "../../../condos/hooks/useCondos";
import { todayStr } from "../../utils/dates";
import { fullName } from "../../utils/name";
import { normalizeText } from "../../utils/normalize";
import {
  ReusableAssignDialog,
  type AssignBaseRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";

type CondoRange = AssignBaseRange & { responsibleEmployeeId?: number | null };

type Props = {
  constructionSiteId: number;
  open: boolean;
  onClose: () => void;
};

export default function AssignCondosDialog({
  constructionSiteId,
  open,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const { data: site } = useConstructionSite(constructionSiteId);

  const {
    employeeRows = [],
    isLoading: empLoading,
    isError: empError,
  } = useEmployees();

  const {
    condosRows = [],
    isLoading: condosLoading,
    isError: condosError,
  } = useCondos();

  const assign = useAssignCondosToConstructionSite();

  const preselected = useMemo(() => {
    const prior = (site as any)?.constructionSiteCondos ?? [];

    const ids: number[] = [];
    const map: Record<number, CondoRange> = {};
    if (!prior.length) return { ids, map };

    const byName = new Map(
      (employeeRows as any[]).map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );

    for (const c of prior as any[]) {
      const condoId = Number(c?.id ?? c?.condoId ?? c?.condo?.id);
      if (!Number.isFinite(condoId)) continue;

      ids.push(condoId);

      let respId: number | null | undefined = c.responsibleEmployeeId;
      if (respId == null && c.responsibleEmployeeName) {
        respId = byName.get(normalizeText(c.responsibleEmployeeName));
      }

      map[condoId] = {
        from: c.dateFrom ?? todayStr(),
        to: c.dateTo ?? todayStr(),
        custom: true,
        responsibleEmployeeId: Number.isFinite(Number(respId))
          ? Number(respId)
          : null,
      };
    }

    return { ids, map };
  }, [site, employeeRows]);

  return (
    <ReusableAssignDialog<any, CondoRange, any>
      open={open}
      title={t("constructionSites.assign.condosTitle")}
      onClose={() => {
        if (assign.isPending) return;
        onClose();
      }}
      items={condosRows}
      loading={empLoading || condosLoading}
      error={empError || condosError}
      emptyText={t("constructionSites.assign.noCondos")}
      loadErrorText={t("constructionSites.assign.loadError")}
      busy={assign.isPending}
      preselected={preselected}
      leftWidthMd="260px"
      detailGridMd="minmax(220px,1fr) 180px 180px minmax(220px,1fr) 48px"
      getItemId={(condo) => Number(condo.id)}
      getItemPrimary={(condo) => condo.name ?? condo.code ?? `#${condo.id}`}
      getItemSecondary={(condo) =>
        condo.address ? String(condo.address) : null
      }
      createRange={({ globalFrom, globalTo }) => ({
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      })}
      renderRowExtra={({ range, setRangePatch }) => (
        <Autocomplete
          size="small"
          options={(employeeRows as any[]) ?? []}
          getOptionLabel={(e: any) =>
            e ? fullName(e.firstName, e.lastName) : ""
          }
          isOptionEqualToValue={(opt: any, val: any) =>
            Number(opt?.id) === Number(val?.id)
          }
          value={
            range.responsibleEmployeeId != null
              ? ((employeeRows as any[]) ?? []).find(
                  (e) => Number(e.id) === Number(range.responsibleEmployeeId)
                ) ?? null
              : null
          }
          onChange={(_, val: any | null) =>
            setRangePatch({
              responsibleEmployeeId: val ? Number(val.id) : null,
            })
          }
          renderInput={(params) => <TextField {...params} />}
        />
      )}
      labels={{
        startLabel: t("constructionSites.assign.global.startLabel"),
        endLabel: t("constructionSites.assign.global.endLabel"),
        cancel: t("constructionSites.assign.actions.cancel"),
        save: t("constructionSites.assign.actions.save"),
        saving: t("constructionSites.assign.actions.saving"),
        invalidRange: t("constructionSites.assign.validation.invalidRange"),
        pickHint: t("constructionSites.assign.pickCondoHint"),
        itemsCountLabel: (count: number) =>
          t("constructionSites.assign.left.condosCount", { count }),
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
        condos:
          selected.length === 0
            ? []
            : selected.map((condoId) => {
                const r =
                  ranges[condoId] ??
                  ({
                    from: globalFrom,
                    to: globalTo,
                    responsibleEmployeeId: null,
                    custom: false,
                  } as CondoRange);

                return {
                  condoId,
                  dateFrom: r.from,
                  dateTo: r.to,
                  responsibleEmployeeId: r.responsibleEmployeeId ?? 0,
                };
              }),
      })}
      onSave={(payload) =>
        assign.mutate(payload as any, { onSuccess: onClose })
      }
    />
  );
}
