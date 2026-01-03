import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import BadgeIcon from "@mui/icons-material/Badge";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HandymanIcon from "@mui/icons-material/Handyman";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useTranslation } from "react-i18next";

import { useConstructionSite } from "../hooks/useConstructionSite";
import type { ConstructionSite } from "..";
import { formatDate } from "../utils/dates";
import {
  HistoryPanelShell,
  pillSx,
} from "../../../components/ui/history/HistoryPanelShell";
import { HistoryAccordionSection } from "../../../components/ui/history/HistoryAccordionSection";
import { HistoryCard } from "../../../components/ui/history/HistoryCard";
import ApartmentIcon from "@mui/icons-material/Apartment";

type SiteEmployee = ConstructionSite["constructionSiteEmployees"][number];
type SiteVehicle = ConstructionSite["constructionSiteVehicles"][number];
type SiteTool = ConstructionSite["constructionSiteTools"][number];
type SiteCondo = ConstructionSite["constructionSiteCondos"][number];

type Props = {
  constructionSiteId: number;
};

export function ConstructionSiteDetailPanel({ constructionSiteId }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data, isLoading, error } = useConstructionSite(constructionSiteId);

  if (isLoading) {
    return (
      <Box
        p={2}
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ bgcolor: "#F7F7F8" }}
      >
        <CircularProgress size={18} />
        <Typography variant="body2" color="text.secondary">
          {t("constructionSites.detailPanel.loading")}
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box p={2} sx={{ bgcolor: "#F7F7F8" }}>
        <Typography color="error" variant="body2">
          {t("constructionSites.detailPanel.loadError")}
        </Typography>
      </Box>
    );
  }

  const employees: SiteEmployee[] = data.constructionSiteEmployees ?? [];
  const vehicles: SiteVehicle[] = data.constructionSiteVehicles ?? [];
  const tools: SiteTool[] = data.constructionSiteTools ?? [];
  const condos: SiteCondo[] = data.constructionSiteCondos ?? [];

  const headerChips = (
    <>
      {data.location && (
        <Chip
          size="small"
          icon={<PlaceIcon sx={{ fontSize: 14 }} />}
          label={data.location}
          sx={{ ...pillSx, bgcolor: alpha(theme.palette.primary.main, 0.04) }}
        />
      )}

      {data.siteManagerName && (
        <Chip
          size="small"
          icon={<BadgeIcon sx={{ fontSize: 14 }} />}
          label={data.siteManagerName}
          sx={{ ...pillSx, bgcolor: alpha(theme.palette.secondary.main, 0.06) }}
        />
      )}

      {(data.startDate || data.plannedEndDate) && (
        <Chip
          size="small"
          icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
          label={`${formatDate(data.startDate)} — ${formatDate(
            data.plannedEndDate
          )}`}
          sx={{ ...pillSx, bgcolor: alpha(theme.palette.info.main, 0.06) }}
        />
      )}
    </>
  );

  return (
    <HistoryPanelShell
      title={`${data.name || t("constructionSites.detailPanel.fallbackName")}${
        data.id ? ` #${data.id}` : ""
      }`}
      headerChips={headerChips}
    >
      <HistoryAccordionSection
        icon={<BadgeIcon sx={{ fontSize: 18 }} />}
        label={t("constructionSites.detail.employees")}
        count={employees.length}
        defaultExpanded
        emptyText={t("constructionSites.detailPanel.noEmployeesAssigned")}
      >
        <Stack spacing={1}>
          {employees.map((emp) => (
            <HistoryCard key={emp.id}>
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {emp.firstName} {emp.lastName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {emp.jobPositionName ?? "—"}
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  <Chip
                    size="small"
                    label={`${formatDate(emp.dateFrom)} — ${formatDate(
                      emp.dateTo
                    )}`}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
                  />
                </Stack>
              </Stack>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<DirectionsCarIcon sx={{ fontSize: 18 }} />}
        label={t("constructionSites.detail.vehicles")}
        count={vehicles.length}
        emptyText={t("constructionSites.detailPanel.noVehiclesAssigned")}
      >
        <Stack spacing={1}>
          {vehicles.map((veh) => (
            <HistoryCard key={veh.id}>
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {veh.name ||
                    veh.registrationNumber ||
                    t("constructionSites.detailPanel.vehicleFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {[veh.brand, veh.model].filter(Boolean).join(" · ") || "—"}
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {veh.registrationNumber && (
                    <Chip
                      size="small"
                      label={veh.registrationNumber}
                      sx={{ bgcolor: alpha(theme.palette.info.main, 0.06) }}
                    />
                  )}

                  {veh.status && (
                    <Chip
                      size="small"
                      label={veh.status}
                      sx={{ bgcolor: alpha(theme.palette.success.main, 0.06) }}
                    />
                  )}

                  <Chip
                    size="small"
                    label={`${formatDate(veh.dateFrom)} — ${formatDate(
                      veh.dateTo
                    )}`}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
                  />
                </Stack>
              </Stack>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>

      <HistoryAccordionSection
        icon={<HandymanIcon sx={{ fontSize: 18 }} />}
        label={t("constructionSites.detail.tools")}
        count={tools.length}
        emptyText={t("constructionSites.detailPanel.noToolsAssigned")}
      >
        <Stack spacing={1}>
          {tools.map((tool) => (
            <HistoryCard key={tool.id}>
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {tool.name ||
                    tool.inventoryNumber ||
                    t("constructionSites.detailPanel.toolFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {[tool.model, tool.serialNumber]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {tool.inventoryNumber && (
                    <Chip
                      size="small"
                      label={`${t("constructionSites.detailPanel.invPrefix")} ${
                        tool.inventoryNumber
                      }`}
                      sx={{ bgcolor: alpha(theme.palette.info.main, 0.06) }}
                    />
                  )}

                  {tool.status && (
                    <Chip
                      size="small"
                      label={tool.status}
                      sx={{ bgcolor: alpha(theme.palette.success.main, 0.06) }}
                    />
                  )}

                  <Chip
                    size="small"
                    label={`${formatDate(tool.dateFrom)} — ${formatDate(
                      tool.dateTo
                    )}`}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
                  />
                </Stack>
              </Stack>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>
      <HistoryAccordionSection
        icon={<ApartmentIcon sx={{ fontSize: 18 }} />}
        label={t("constructionSites.detail.condos")}
        count={condos.length}
        emptyText={t("constructionSites.detailPanel.noCondosAssigned")}
      >
        <Stack spacing={1}>
          {condos.map((condo) => (
            <HistoryCard key={condo.id}>
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {condo.address ||
                    t("constructionSites.detailPanel.condoFallback")}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {[
                    condo.responsibleEmployeeName
                      ? t("constructionSites.detailPanel.responsible", {
                          name: condo.responsibleEmployeeName,
                        })
                      : null,
                    typeof condo.capacity === "number"
                      ? t("constructionSites.detailPanel.capacity", {
                          count: condo.capacity,
                        })
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {typeof condo.currentlyOccupied === "number" &&
                  typeof condo.capacity === "number" ? (
                    <Chip
                      size="small"
                      label={t("constructionSites.detailPanel.occupied", {
                        occupied: condo.currentlyOccupied,
                        capacity: condo.capacity,
                      })}
                      sx={{ bgcolor: alpha(theme.palette.info.main, 0.06) }}
                    />
                  ) : null}

                  {typeof condo.pricePerMonth === "number" ? (
                    <Chip
                      size="small"
                      label={`${condo.pricePerMonth} ${
                        condo.currency ?? ""
                      }/${t("constructionSites.detailPanel.perMonthShort")}`}
                      sx={{ bgcolor: alpha(theme.palette.success.main, 0.06) }}
                    />
                  ) : null}

                  {typeof condo.pricePerDay === "number" ? (
                    <Chip
                      size="small"
                      label={`${condo.pricePerDay} ${condo.currency ?? ""}/${t(
                        "constructionSites.detailPanel.perDayShort"
                      )}`}
                      sx={{ bgcolor: alpha(theme.palette.success.main, 0.06) }}
                    />
                  ) : null}

                  {condo.leaseStartDate || condo.leaseEndDate ? (
                    <Chip
                      size="small"
                      label={`${formatDate(
                        condo.leaseStartDate
                      )} — ${formatDate(condo.leaseEndDate)}`}
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.06),
                      }}
                    />
                  ) : null}

                  <Chip
                    size="small"
                    label={`${formatDate(condo.dateFrom)} — ${formatDate(
                      condo.dateTo
                    )}`}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
                  />
                </Stack>

                {condo.notes ? (
                  <Typography variant="caption" color="text.secondary">
                    {condo.notes}
                  </Typography>
                ) : null}
              </Stack>
            </HistoryCard>
          ))}
        </Stack>
      </HistoryAccordionSection>
    </HistoryPanelShell>
  );
}
