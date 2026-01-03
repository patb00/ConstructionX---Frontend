import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ReusableAssignDialog,
  type AssignBaseRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";
import { useConstructionSite } from "../../hooks/useConstructionSite";
import { useEmployees } from "../../../administration/employees/hooks/useEmployees";
import { useTools } from "../../../tools/hooks/useTools";
import { useAssignToolsToConstructionSite } from "../../hooks/useAssignToolsToConstructionSite";
import { normalizeText } from "../../utils/normalize";
import { todayStr } from "../../utils/dates";
import { fullName } from "../../utils/name";

type ToolRange = AssignBaseRange & { responsibleEmployeeId?: number | null };

type Props = {
  constructionSiteId: number;
  open: boolean;
  onClose: () => void;
};

export default function AssignToolsDialog({
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
    toolsRows = [],
    isLoading: toolLoading,
    isError: toolError,
  } = useTools();
  const assign = useAssignToolsToConstructionSite();

  const preselected = useMemo(() => {
    const prior = site?.constructionSiteTools ?? [];
    const ids: number[] = [];
    const map: Record<number, ToolRange> = {};
    if (!prior.length) return { ids, map };

    const byName = new Map(
      employeeRows.map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );

    for (const item of prior as any[]) {
      const toolId = Number(item.id);
      if (!Number.isFinite(toolId)) continue;
      ids.push(toolId);

      let respId: number | null | undefined = item.responsibleEmployeeId;
      if (respId == null && item.responsibleEmployeeName) {
        respId = byName.get(normalizeText(item.responsibleEmployeeName));
      }

      map[toolId] = {
        from: item.dateFrom ?? todayStr(),
        to: item.dateTo ?? todayStr(),
        custom: true,
        responsibleEmployeeId: Number.isFinite(Number(respId))
          ? Number(respId)
          : null,
      };
    }

    return { ids, map };
  }, [site, employeeRows]);

  return (
    <ReusableAssignDialog<any, ToolRange, any>
      open={open}
      title={t("constructionSites.assign.toolsTitle")}
      onClose={() => {
        if (assign.isPending) return;
        onClose();
      }}
      items={toolsRows}
      loading={empLoading || toolLoading}
      error={empError || toolError}
      emptyText={t("constructionSites.assign.noTools")}
      loadErrorText={t("constructionSites.assign.loadError")}
      busy={assign.isPending}
      preselected={preselected}
      getItemId={(tool) => Number(tool.id)}
      getItemPrimary={(tool) => tool.name ?? tool.model ?? `#${tool.id}`}
      getItemSecondary={(tool) =>
        tool.inventoryNumber ? `Inv. br.: ${tool.inventoryNumber}` : null
      }
      detailGridMd="minmax(220px,1fr) 180px 180px minmax(220px,1fr) 48px"
      createRange={({ globalFrom, globalTo }) => ({
        from: globalFrom,
        to: globalTo,
        custom: false,
        responsibleEmployeeId: null,
      })}
      renderRowExtra={({ range, setRangePatch }) => (
        <Autocomplete
          size="small"
          options={employeeRows as any[]}
          getOptionLabel={(e: any) =>
            e ? fullName(e.firstName, e.lastName) : ""
          }
          isOptionEqualToValue={(opt: any, val: any) =>
            Number(opt?.id) === Number(val?.id)
          }
          value={
            range.responsibleEmployeeId != null
              ? (employeeRows as any[]).find(
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
        pickHint: t("constructionSites.assign.pickToolHint"),
        itemsCountLabel: (count: number) =>
          t("constructionSites.assign.left.vehiclesCount", { count }),
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
        tools:
          selected.length === 0
            ? []
            : selected.map((toolId) => {
                const r = ranges[toolId] ?? {
                  from: globalFrom,
                  to: globalTo,
                  responsibleEmployeeId: null,
                };
                return {
                  toolId,
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
