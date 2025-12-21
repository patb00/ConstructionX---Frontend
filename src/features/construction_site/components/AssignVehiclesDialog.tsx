import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useEmployees } from "../../administration/employees/hooks/useEmployees";
import { useVehicles } from "../../vehicles/hooks/useVehicles";
import { useConstructionSite } from "../hooks/useConstructionSite";
import { useAssignVehiclesToConstructionSite } from "../hooks/useAssignVehiclesToConstructionSite";

import { todayStr } from "../utils/dates";
import { fullName } from "../utils/name";
import {
  ReusableAssignDialog,
  type AssignBaseRange,
} from "../../../components/ui/assign-dialog/AssignDialog";
import { normalizeText } from "../utils/normalize";

type VehRange = AssignBaseRange & {
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
    const map: Record<number, VehRange> = {};
    if (!prior.length) return { ids, map };

    const byName = new Map(
      (employeeRows as any[]).map((e: any) => [
        normalizeText(fullName(e.firstName, e.lastName)),
        Number(e.id),
      ])
    );

    for (const v of prior as any[]) {
      const vehId = Number(v?.id);
      if (!Number.isFinite(vehId)) continue;
      ids.push(vehId);

      let respId: number | null | undefined = v.responsibleEmployeeId;
      if (respId == null && v.responsibleEmployeeName) {
        respId = byName.get(normalizeText(v.responsibleEmployeeName));
      }

      map[vehId] = {
        from: v.dateFrom ?? todayStr(),
        to: v.dateTo ?? todayStr(),
        custom: true,
        responsibleEmployeeId: Number.isFinite(Number(respId))
          ? Number(respId)
          : null,
      };
    }

    return { ids, map };
  }, [site, employeeRows]);

  return (
    <ReusableAssignDialog<any, VehRange, any>
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
                const r =
                  ranges[vehicleId] ??
                  ({
                    from: globalFrom,
                    to: globalTo,
                    responsibleEmployeeId: null,
                    custom: false,
                  } as VehRange);

                return {
                  vehicleId,
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
