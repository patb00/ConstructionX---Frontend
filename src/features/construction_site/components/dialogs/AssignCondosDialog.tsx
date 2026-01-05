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
  type AssignBaseWindow,
  type AssignRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";

type CondoWindow = AssignBaseWindow & { responsibleEmployeeId?: number | null };

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
    const map: Record<number, AssignRange<CondoWindow>> = {};
    if (!prior.length) return { ids, map };

    const byName = new Map(
      (employeeRows as any[]).map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );

    const bucket = new Map<number, CondoWindow[]>();

    for (const c of prior as any[]) {
      const condoId = Number(c?.id ?? c?.condoId ?? c?.condo?.id);
      if (!Number.isFinite(condoId)) continue;

      let respId: number | null | undefined = c.responsibleEmployeeId;
      if (respId == null && c.responsibleEmployeeName) {
        respId = byName.get(normalizeText(c.responsibleEmployeeName));
      }

      if (!bucket.has(condoId)) bucket.set(condoId, []);
      bucket.get(condoId)!.push({
        from: c.dateFrom ?? todayStr(),
        to: c.dateTo ?? todayStr(),
        custom: true,
        responsibleEmployeeId: Number.isFinite(Number(respId))
          ? Number(respId)
          : null,
      });
    }

    for (const [id, windows] of bucket.entries()) {
      ids.push(id);
      map[id] = { windows };
    }

    return { ids, map };
  }, [site, employeeRows]);

  return (
    <ReusableAssignDialog<any, CondoWindow, any>
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
      detailGridMd="minmax(140px,1fr) 180px 180px minmax(220px,1fr)"
      allowMultipleWindows={false}
      getItemId={(condo) => Number(condo.id)}
      getItemPrimary={(condo) => condo.name ?? condo.code ?? `#${condo.id}`}
      getItemSecondary={(condo) =>
        condo.address ? String(condo.address) : null
      }
      createWindow={({ globalFrom, globalTo }) => ({
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      })}
      renderWindowExtra={({ window, setWindowPatch }) => (
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
            window.responsibleEmployeeId != null
              ? ((employeeRows as any[]) ?? []).find(
                  (e) => Number(e.id) === Number(window.responsibleEmployeeId)
                ) ?? null
              : null
          }
          onChange={(_, val: any | null) =>
            setWindowPatch({
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
                const window =
                  ranges[condoId]?.windows?.[0] ??
                  ({
                    from: globalFrom,
                    to: globalTo,
                    responsibleEmployeeId: null,
                    custom: false,
                  } as CondoWindow);

                return {
                  condoId,
                  dateFrom: window.from,
                  dateTo: window.to,
                  responsibleEmployeeId: window.responsibleEmployeeId ?? 0,
                };
              }),
      })}
      onSave={(payload) =>
        assign.mutate(payload as any, { onSuccess: onClose })
      }
    />
  );
}
