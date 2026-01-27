import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ReusableAssignDialog,
  type AssignBaseWindow,
  type AssignRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";
import { useConstructionSite } from "../../hooks/useConstructionSite";
import { useEmployees } from "../../../administration/employees/hooks/useEmployees";
import { useTools } from "../../../tools/hooks/useTools";
import { useAssignToolsToConstructionSite } from "../../hooks/useAssignToolsToConstructionSite";
import { normalizeText } from "../../utils/normalize";
import { todayStr } from "../../utils/dates";
import { fullName } from "../../utils/name";

type ToolWindow = AssignBaseWindow & {
  responsibleEmployeeId?: number | null;
};

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
    const map: Record<number, AssignRange<ToolWindow>> = {};
    if (!prior.length) return { ids, map };

    const byName = new Map(
      (employeeRows as any[]).map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ]),
    );

    const bucket = new Map<number, ToolWindow[]>();

    for (const item of prior as any[]) {
      const toolId = Number(item?.id);
      if (!Number.isFinite(toolId)) continue;

      if (!bucket.has(toolId)) bucket.set(toolId, []);

      const windows =
        item?.assignmentWindows && item.assignmentWindows.length > 0
          ? item.assignmentWindows
          : [
              {
                dateFrom: item.dateFrom ?? todayStr(),
                dateTo: item.dateTo ?? todayStr(),
                responsibleEmployeeId: item.responsibleEmployeeId,
                responsibleEmployeeName: item.responsibleEmployeeName,
              },
            ];

      windows.forEach((window: any) => {
        let respId: number | null | undefined =
          window?.responsibleEmployeeId ?? item.responsibleEmployeeId;

        const respName =
          window?.responsibleEmployeeName ?? item.responsibleEmployeeName;

        if (respId == null && respName) {
          respId = byName.get(normalizeText(respName));
        }

        bucket.get(toolId)!.push({
          from: window?.dateFrom ?? item.dateFrom ?? todayStr(),
          to: window?.dateTo ?? item.dateTo ?? todayStr(),
          custom: true,
          responsibleEmployeeId: Number.isFinite(Number(respId))
            ? Number(respId)
            : null,
        });
      });
    }

    for (const [id, windows] of bucket.entries()) {
      ids.push(id);
      map[id] = { windows };
    }

    return { ids, map };
  }, [site, employeeRows]);

  return (
    <ReusableAssignDialog<any, ToolWindow, any>
      open={open}
      title={t("constructionSites.assign.toolsTitle")}
      onClose={() => {
        if (assign.isPending) return;
        onClose();
      }}
      items={toolsRows as any[]}
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
      detailGridMd="minmax(140px,1fr) 180px 180px minmax(220px,1fr)"
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
          getOptionLabel={(e: any) => {
            const label = e ? fullName(e.firstName, e.lastName) : "";
            console.log("[getOptionLabel] option:", e, "label:", label);
            return label;
          }}
          isOptionEqualToValue={(opt: any, val: any) =>
            Number(opt?.id) === Number(val?.id)
          }
          value={
            window.responsibleEmployeeId != null
              ? (((employeeRows as any[]) ?? []).find(
                  (e) => Number(e.id) === Number(window.responsibleEmployeeId),
                ) ?? null)
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
        pickHint: t("constructionSites.assign.pickToolHint"),
        itemsCountLabel: (count: number) =>
          t("constructionSites.assign.left.vehiclesCount", { count }),
        selectedCountLabel: (count: number) =>
          t("constructionSites.assign.left.selectedCount", { count }),
        chipGlobal: t("constructionSites.assign.chip.global"),
        chipCustom: t("constructionSites.assign.chip.custom"),
        resetToGlobalTooltip: t(
          "constructionSites.assign.tooltip.resetToGlobal",
        ),
        addWindow: t("constructionSites.assign.window.add"),
        windowLabel: (i: number) =>
          t("constructionSites.assign.window.label", { index: i + 1 }),
        removeWindowTooltip: t("constructionSites.assign.window.remove"),
        windowsCountLabel: (count: number) =>
          t("constructionSites.assign.window.count", { count }),
      }}
      buildPayload={({ selected, ranges, globalFrom, globalTo }) => ({
        constructionSiteId,
        tools:
          selected.length === 0
            ? []
            : selected.map((toolId) => {
                const windows =
                  ranges[toolId]?.windows ??
                  ([
                    {
                      from: globalFrom,
                      to: globalTo,
                      responsibleEmployeeId: 0,
                    },
                  ] as ToolWindow[]);

                return {
                  toolId,
                  assignmentWindows: windows.map((window) => ({
                    dateFrom: window.from,
                    dateTo: window.to,
                    responsibleEmployeeId: window.responsibleEmployeeId ?? 0,
                  })),
                };
              }),
      })}
      onSave={(payload) =>
        assign.mutate(payload as any, { onSuccess: onClose })
      }
    />
  );
}
