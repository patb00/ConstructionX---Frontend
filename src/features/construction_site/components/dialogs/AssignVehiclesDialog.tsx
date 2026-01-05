import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useConstructionSite } from "../../hooks/useConstructionSite";
import {
  ReusableAssignDialog,
  type AssignBaseWindow,
  type AssignRange,
} from "../../../../components/ui/assign-dialog/AssignDialog";
import { useAssignVehiclesToConstructionSite } from "../../hooks/useAssignVehiclesToConstructionSite";
import { useVehicles } from "../../../vehicles/hooks/useVehicles";
import { useEmployees } from "../../../administration/employees/hooks/useEmployees";
import { fullName } from "../../utils/name";
import { normalizeText } from "../../utils/normalize";
import { todayStr } from "../../utils/dates";

type VehWindow = AssignBaseWindow & {
  responsibleEmployeeId?: number | null;
};

type Props = {
  constructionSiteId: number;
  open: boolean;
  onClose: () => void;
};

export default function AssignVehiclesDialog({
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
    vehiclesRows = [],
    isLoading: vehLoading,
    isError: vehError,
  } = useVehicles();

  const assign = useAssignVehiclesToConstructionSite();

  const preselected = useMemo(() => {
    const prior = site?.constructionSiteVehicles ?? [];
    const ids: number[] = [];
    const map: Record<number, AssignRange<VehWindow>> = {};
    if (!prior.length) return { ids, map };

    const byName = new Map(
      (employeeRows as any[]).map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );

    const bucket = new Map<number, VehWindow[]>();

    for (const v of prior as any[]) {
      const vehId = Number(v?.id);
      if (!Number.isFinite(vehId)) continue;

      if (!bucket.has(vehId)) bucket.set(vehId, []);

      const windows =
        v?.assignmentWindows && v.assignmentWindows.length > 0
          ? v.assignmentWindows
          : [
              {
                dateFrom: v.dateFrom ?? todayStr(),
                dateTo: v.dateTo ?? todayStr(),
                responsibleEmployeeId: v.responsibleEmployeeId,
                responsibleEmployeeName: v.responsibleEmployeeName,
              },
            ];

      windows.forEach((window: any) => {
        let respId: number | null | undefined =
          window?.responsibleEmployeeId ?? v.responsibleEmployeeId;
        const respName = window?.responsibleEmployeeName ?? v.responsibleEmployeeName;
        if (respId == null && respName) {
          respId = byName.get(normalizeText(respName));
        }

        bucket.get(vehId)!.push({
          from: window?.dateFrom ?? todayStr(),
          to: window?.dateTo ?? todayStr(),
          custom: true,
          responsibleEmployeeId: Number.isFinite(Number(respId))
            ? Number(respId)
            : null,
        });
      });
    }

      if (!bucket.has(vehId)) bucket.set(vehId, []);
      bucket.get(vehId)!.push({
        from: v.dateFrom ?? todayStr(),
        to: v.dateTo ?? todayStr(),
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
    <ReusableAssignDialog<any, VehWindow, any>
      open={open}
      title={t("constructionSites.assign.vehiclesTitle")}
      onClose={() => {
        if (assign.isPending) return;
        onClose();
      }}
      items={vehiclesRows as any[]}
      getItemId={(v) => Number(v.id)}
      getItemPrimary={(v) => v.name ?? `ID ${v.id}`}
      getItemSecondary={(v) =>
        v.registrationNumber ? `Reg.: ${v.registrationNumber}` : null
      }
      preselected={preselected}
      leftWidthMd="260px"
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
      loading={empLoading || vehLoading}
      error={empError || vehError}
      emptyText={t("constructionSites.assign.noVehicles")}
      loadErrorText={t("constructionSites.assign.loadError")}
      busy={assign.isPending}
      labels={{
        startLabel: t("constructionSites.assign.global.startLabel"),
        endLabel: t("constructionSites.assign.global.endLabel"),
        cancel: t("constructionSites.assign.actions.cancel"),
        save: t("constructionSites.assign.actions.save"),
        saving: t("constructionSites.assign.actions.saving"),
        invalidRange: t("constructionSites.assign.validation.invalidRange"),
        pickHint: t("constructionSites.assign.pickVehicleHint"),
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
        vehicles:
          selected.length === 0
            ? []
            : selected.map((vehicleId) => {
                const windows =
                  ranges[vehicleId]?.windows ??
                  ([{ from: globalFrom, to: globalTo, responsibleEmployeeId: 0 }] as VehWindow[]);

                return {
                  vehicleId,
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
