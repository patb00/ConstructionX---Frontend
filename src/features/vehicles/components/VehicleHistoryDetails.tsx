import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useTranslation } from "react-i18next";
import BuildIcon from "@mui/icons-material/Build";
import type { VehicleHistoryItem } from "..";
import { useVehicleHistory } from "../hooks/useVehicleHistory";
import { useVehicleRegistrationsByVehicle } from "../../vehicle_registrations/hooks/useVehicleRegistrationsByVehicle";
import { useVehicleBusinessTripsByVehicle } from "../../vehicle_business_trips/hooks/useVehicleBusinessTripsByVehicle";
import { useVehicleInsurancesByVehicle } from "../../vehicle_insurance/hooks/useVehicleInsurancesByVehicle";

import {
  HistoryPanelShell,
  pillSx,
} from "../../../components/ui/history/HistoryPanelShell";
import { HistoryCard } from "../../../components/ui/history/HistoryCard";
import { HistoryAccordionSection } from "../../../components/ui/history/HistoryAccordionSection";
import { useVehicleRepairsByVehicle } from "../../vehicles_repairs/hooks/useVehicleRepairsByVehicle";

function formatRange(from?: string | null, to?: string | null) {
  const f = from ?? "";
  return to ? `${f} → ${to}` : `${f} → (ongoing)`;
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "";
  return iso.replace("T", " ").slice(0, 16);
}

export function VehicleHistoryDetails({ vehicleId }: { vehicleId: number }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    historyRows,
    total,
    paginationModel,
    setPaginationModel,
    isLoading,
    isFetching,
    error,
  } = useVehicleHistory(vehicleId);

  const registrationsQuery = useVehicleRegistrationsByVehicle(vehicleId);
  const businessTripsQuery = useVehicleBusinessTripsByVehicle(vehicleId);
  const insurancesQuery = useVehicleInsurancesByVehicle(vehicleId);
  const repairsQuery = useVehicleRepairsByVehicle(vehicleId);

  const [accumulated, setAccumulated] = useState<VehicleHistoryItem[]>([]);

  useEffect(() => {
    setAccumulated([]);
    setPaginationModel((p) => ({ ...p, page: 0 }));
  }, [vehicleId]);

  useEffect(() => {
    if (!historyRows) return;

    setAccumulated((prev) => {
      if (paginationModel.page === 0) return historyRows;

      const seen = new Set(
        prev.map(
          (x) =>
            `${x.constructionSiteId}-${x.responsibleEmployeeId}-${x.dateFrom}-${
              x.dateTo ?? "ongoing"
            }`
        )
      );

      const next = [...prev];
      for (const row of historyRows) {
        const k = `${row.constructionSiteId}-${row.responsibleEmployeeId}-${
          row.dateFrom
        }-${row.dateTo ?? "ongoing"}`;
        if (!seen.has(k)) next.push(row);
      }
      return next;
    });
  }, [historyRows, paginationModel.page]);

  const canLoadMore = accumulated.length < (total ?? 0);

  const rows = useMemo(() => accumulated ?? [], [accumulated]);
  const regs = registrationsQuery.data ?? [];
  const trips = businessTripsQuery.data ?? [];
  const ins = insurancesQuery.data ?? [];
  const repPage = repairsQuery.data;
  const repItems = repPage?.items ?? [];

  return (
    <HistoryPanelShell
      title={t("history.vehicle.title")}
      headerChips={
        <Chip
          size="small"
          icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
          label={`${t("history.common.vehicleId")}: ${vehicleId}`}
          sx={{ ...pillSx, bgcolor: alpha(theme.palette.primary.main, 0.04) }}
        />
      }
    >
      <HistoryAccordionSection
        defaultExpanded
        icon={<AssignmentIcon sx={{ fontSize: 18 }} />}
        label={t("history.vehicle.assignments")}
        count={total ?? rows.length}
        isLoading={isLoading && paginationModel.page === 0}
        isError={!!error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.vehicle.emptyAssignments")}
      >
        <Stack spacing={1}>
          {rows.map((it, idx) => (
            <HistoryCard
              key={`${it.constructionSiteId}-${it.responsibleEmployeeId}-${
                it.dateFrom
              }-${it.dateTo ?? "ongoing"}-${idx}`}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {it.constructionSiteName}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {it.constructionSiteLocation ?? "—"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={formatRange(it.dateFrom, it.dateTo)}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />
                </Stack>
              </Box>
            </HistoryCard>
          ))}

          <Box sx={{ pt: 0.5 }}>
            <Button
              size="small"
              variant="text"
              disabled={!canLoadMore || isFetching}
              onClick={() =>
                setPaginationModel((p) => ({ ...p, page: p.page + 1 }))
              }
            >
              {isFetching
                ? t("history.common.loading")
                : t("history.common.loadMore")}
            </Button>
          </Box>
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<FactCheckIcon sx={{ fontSize: 18 }} />}
        label={t("history.vehicle.registrations")}
        count={regs.length}
        isLoading={registrationsQuery.isLoading}
        isError={!!registrationsQuery.error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.vehicle.emptyRegistrations")}
      >
        <Stack spacing={1}>
          {regs.map((r: any) => (
            <HistoryCard key={String(r.id)}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {r.registrationStationName ||
                    t("history.vehicle.registrationFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {[r.registrationStationLocation, r.reportNumber]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={formatRange(r.validFrom, r.validTo)}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />

                  {typeof r.totalCostAmount === "number" && (
                    <Chip
                      size="small"
                      label={`${r.totalCostAmount} ${String(
                        r.costCurrency ?? ""
                      ).toUpperCase()}`}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.success.main, 0.06),
                      }}
                    />
                  )}

                  {r.note && (
                    <Chip
                      size="small"
                      label={r.note}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.secondary.main, 0.06),
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<FlightTakeoffIcon sx={{ fontSize: 18 }} />}
        label={t("history.vehicle.trips")}
        count={trips.length}
        isLoading={businessTripsQuery.isLoading}
        isError={!!businessTripsQuery.error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.vehicle.emptyTrips")}
      >
        <Stack spacing={1}>
          {trips.map((bt: any) => (
            <HistoryCard key={String(bt.id)}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {[bt.startLocationText, bt.endLocationText]
                    .filter(Boolean)
                    .join(" → ") || t("history.vehicle.tripFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {[
                    bt.employeeId && `Employee #${bt.employeeId}`,
                    bt.tripStatus != null && `Status ${bt.tripStatus}`,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={`${formatDateTime(bt.startAt)} → ${
                      bt.endAt
                        ? formatDateTime(bt.endAt)
                        : t("history.common.ongoing")
                    }`}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />

                  {bt.refueled && (
                    <Chip
                      size="small"
                      label={t("history.vehicle.refueled")}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.success.main, 0.06),
                      }}
                    />
                  )}

                  {bt.note && (
                    <Chip
                      size="small"
                      label={bt.note}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.secondary.main, 0.06),
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
        label={t("history.vehicle.insurance")}
        count={ins.length}
        isLoading={insurancesQuery.isLoading}
        isError={!!insurancesQuery.error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.vehicle.emptyInsurance")}
      >
        <Stack spacing={1}>
          {ins.map((i: any) => (
            <HistoryCard key={String(i.id)}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {i.insurer || t("history.vehicle.insuranceFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {[
                    i.policyNumber,
                    i.policyType != null ? `#${i.policyType}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  <Chip
                    size="small"
                    label={formatRange(i.validFrom, i.validTo)}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />

                  {typeof i.costAmount === "number" ? (
                    <Chip
                      size="small"
                      label={`${i.costAmount} ${String(
                        i.costCurrency ?? ""
                      ).toUpperCase()}`}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.success.main, 0.06),
                      }}
                    />
                  ) : null}
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<BuildIcon sx={{ fontSize: 18 }} />}
        label={t("history.vehicle.repairs")}
        count={repPage?.total ?? repItems.length}
        isLoading={repairsQuery.isLoading}
        isError={!!repairsQuery.error}
        errorText={t("history.common.loadError")}
        emptyText={t("history.vehicle.emptyRepairs")}
      >
        <Stack spacing={1}>
          {repItems.map((r: any) => (
            <HistoryCard key={String(r.id)}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {r.repairDate || t("history.vehicle.repairFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {[r.condition].filter(Boolean).join(" · ") || "—"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 0.5 }}
                  alignItems="center"
                >
                  {typeof r.cost === "number" && (
                    <Chip
                      size="small"
                      label={`${r.cost}`}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.success.main, 0.06),
                      }}
                    />
                  )}

                  {r.description && (
                    <Chip
                      size="small"
                      label={r.description}
                      sx={{
                        ...pillSx,
                        bgcolor: alpha(theme.palette.secondary.main, 0.06),
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>
    </HistoryPanelShell>
  );
}
