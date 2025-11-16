import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import BadgeIcon from "@mui/icons-material/Badge";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HandymanIcon from "@mui/icons-material/Handyman";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useTranslation } from "react-i18next";

import { useConstructionSite } from "../hooks/useConstructionSite";
import type { ConstructionSite } from "..";

// Helper types from your main type
type SiteEmployee = ConstructionSite["constructionSiteEmployees"][number];
type SiteVehicle = ConstructionSite["constructionSiteVehicles"][number];
type SiteTool = ConstructionSite["constructionSiteTools"][number];

type Props = {
  constructionSiteId: number;
};

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

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

  const pillSx = {
    borderRadius: 999,
    fontSize: 11,
    px: 1.2,
    py: 0.2,
  } as const;

  return (
    <Box
      p={2}
      sx={{
        bgcolor: "#F7F7F8",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 0.5, lineHeight: 1.3 }}
        >
          {data.name || t("constructionSites.detailPanel.fallbackName")}{" "}
          {data.id && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                ml: 0.5,
                px: 0.8,
                py: 0.1,
                borderRadius: 999,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              #{data.id}
            </Typography>
          )}
        </Typography>

        <Stack
          direction="row"
          spacing={0.75}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 1.5 }}
        >
          {data.location && (
            <Chip
              size="small"
              icon={<PlaceIcon sx={{ fontSize: 14 }} />}
              label={data.location}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              }}
            />
          )}

          {data.siteManagerName && (
            <Chip
              size="small"
              icon={<BadgeIcon sx={{ fontSize: 14 }} />}
              label={data.siteManagerName}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.secondary.main, 0.06),
              }}
            />
          )}

          {(data.startDate || data.plannedEndDate) && (
            <Chip
              size="small"
              icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
              label={`${formatDate(data.startDate)} — ${formatDate(
                data.plannedEndDate
              )}`}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.info.main, 0.06),
              }}
            />
          )}
        </Stack>

        <Divider />
      </Box>

      <Stack spacing={2.5} sx={{ overflowY: "auto", pr: 0.5 }}>
        {/* Employees */}
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <BadgeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                {t("constructionSites.detail.employees")}
              </Typography>
            </Stack>

            <Chip
              size="small"
              label={employees.length}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                fontWeight: 600,
              }}
            />
          </Stack>

          {employees.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detailPanel.noEmployeesAssigned")}
            </Typography>
          ) : (
            <Stack spacing={1}>
              {employees.map((emp) => (
                <Paper
                  key={emp.id}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    borderColor: "divider",
                    boxShadow:
                      "0 1px 2px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                  variant="outlined"
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      sx={{ mb: 0.25 }}
                    >
                      {emp.firstName} {emp.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {emp.jobPositionName ||
                        t("constructionSites.detailPanel.noPosition")}
                    </Typography>
                  </Box>

                  <Chip
                    size="small"
                    label={`${formatDate(emp.dateFrom)} — ${formatDate(
                      emp.dateTo
                    )}`}
                    sx={{
                      ...pillSx,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                    }}
                  />
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        {/* Vehicles */}
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <DirectionsCarIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                {t("constructionSites.detail.vehicles")}
              </Typography>
            </Stack>

            <Chip
              size="small"
              label={vehicles.length}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                fontWeight: 600,
              }}
            />
          </Stack>

          {vehicles.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detailPanel.noVehiclesAssigned")}
            </Typography>
          ) : (
            <Stack spacing={1}>
              {vehicles.map((veh) => (
                <Paper
                  key={veh.id}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    borderColor: "divider",
                    boxShadow:
                      "0 1px 2px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                  }}
                  variant="outlined"
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ mb: 0.25 }}
                    noWrap
                  >
                    {veh.name ||
                      veh.registrationNumber ||
                      t("constructionSites.detailPanel.vehicleFallback")}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" noWrap>
                    {[veh.brand, veh.model].filter(Boolean).join(" · ") || "—"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5, flexWrap: "wrap", rowGap: 0.5 }}
                  >
                    {veh.registrationNumber && (
                      <Chip
                        size="small"
                        label={veh.registrationNumber}
                        sx={{
                          ...pillSx,
                          bgcolor: alpha(theme.palette.info.main, 0.06),
                        }}
                      />
                    )}
                    {veh.status && (
                      <Chip
                        size="small"
                        label={veh.status}
                        sx={{
                          ...pillSx,
                          bgcolor: alpha(theme.palette.success.main, 0.06),
                        }}
                      />
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {formatDate(veh.dateFrom)} — {formatDate(veh.dateTo)}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        {/* Tools */}
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <HandymanIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                {t("constructionSites.detail.tools")}
              </Typography>
            </Stack>

            <Chip
              size="small"
              label={tools.length}
              sx={{
                ...pillSx,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                fontWeight: 600,
              }}
            />
          </Stack>

          {tools.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("constructionSites.detailPanel.noToolsAssigned")}
            </Typography>
          ) : (
            <Stack spacing={1}>
              {tools.map((tool) => (
                <Paper
                  key={tool.id}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    borderColor: "divider",
                    boxShadow:
                      "0 1px 2px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                  }}
                  variant="outlined"
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ mb: 0.25 }}
                    noWrap
                  >
                    {tool.name ||
                      tool.inventoryNumber ||
                      t("constructionSites.detailPanel.toolFallback")}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" noWrap>
                    {[tool.model, tool.serialNumber]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5, flexWrap: "wrap", rowGap: 0.5 }}
                  >
                    {tool.inventoryNumber && (
                      <Chip
                        size="small"
                        label={`${t(
                          "constructionSites.detailPanel.invPrefix"
                        )} ${tool.inventoryNumber}`}
                        sx={{
                          ...pillSx,
                          bgcolor: alpha(theme.palette.info.main, 0.06),
                        }}
                      />
                    )}
                    {tool.status && (
                      <Chip
                        size="small"
                        label={tool.status}
                        sx={{
                          ...pillSx,
                          bgcolor: alpha(theme.palette.success.main, 0.06),
                        }}
                      />
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {formatDate(tool.dateFrom)} — {formatDate(tool.dateTo)}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
