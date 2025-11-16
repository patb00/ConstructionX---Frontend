import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { Construction, DirectionsCar, Handyman } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type {
  AssignedConstructionSite,
  AssignedTool,
  AssignedVehicle,
} from "../../administration/employees";

type BoardSlice<T> = {
  rows: T[];
  loading: boolean;
};

type Props = {
  construction: BoardSlice<AssignedConstructionSite>;
  vehicles: BoardSlice<AssignedVehicle>;
  tools: BoardSlice<AssignedTool>;
};

export const AssignmentsBoardView: React.FC<Props> = ({
  construction,
  vehicles,
  tools,
}) => {
  const { t } = useTranslation();

  const counts = {
    construction: construction.rows.length,
    vehicles: vehicles.rows.length,
    tools: tools.rows.length,
  };

  const columnSx = {
    flexGrow: 1,
    flexBasis: {
      xs: "100%",
      sm: "100%",
      md: "calc(33.333% - 16px)",
    },
    minWidth: 0,
  } as const;

  const renderDates = (from?: string | null, to?: string | null) => {
    if (!from && !to) return "—";
    if (from && !to) return from;
    if (!from && to) return to;
    if (from === to) return from;
    return `${from} – ${to}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Box sx={columnSx}>
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Construction color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
            >
              {t("assignments.construction")} ({counts.construction})
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
        </Box>

        {construction.loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={22} />
          </Box>
        ) : counts.construction === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("assignments.emptyConstruction")}
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {construction.rows.map((row) => (
              <Card
                key={`${row.constructionSiteId}-${row.employeeId ?? ""}-${
                  row.dateFrom ?? ""
                }`}
                sx={{ p: 1.5 }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 0.25 }}
                  noWrap
                >
                  {row.name || "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                  noWrap
                >
                  {row.location || t("assignments.noLocation")}
                </Typography>

                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ display: "block", mb: 0.25 }}
                >
                  {t("assignments.assignmentRange")}{" "}
                  {renderDates(row.dateFrom, row.dateTo)}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.25 }}
                >
                  {t("assignments.siteRange")}{" "}
                  {renderDates(row.startDate, row.plannedEndDate)}
                </Typography>

                {row.siteManagerName && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.25 }}
                    noWrap
                  >
                    {t("assignments.managerLabel")} {row.siteManagerName}
                  </Typography>
                )}
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={columnSx}>
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DirectionsCar color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
            >
              {t("assignments.vehicles")} ({counts.vehicles})
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
        </Box>

        {vehicles.loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={22} />
          </Box>
        ) : counts.vehicles === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("assignments.emptyVehicles")}
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {vehicles.rows.map((row) => (
              <Card
                key={`${row.vehicleId}-${row.responsibleEmployeeId ?? ""}-${
                  row.dateFrom ?? ""
                }`}
                sx={{ p: 1.5 }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 0.25 }}
                  noWrap
                >
                  {row.registrationNumber || row.constructionSiteName || "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.25 }}
                  noWrap
                >
                  {[row.brand, row.model].filter(Boolean).join(" · ") || "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                  noWrap
                >
                  {[row.constructionSiteName, row.constructionSiteLocation]
                    .filter(Boolean)
                    .join(" · ") || t("assignments.noSite")}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ flexWrap: "wrap", rowGap: 0.5 }}
                >
                  {row.vehicleType && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={row.vehicleType}
                    />
                  )}
                  {row.yearOfManufacturing && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={row.yearOfManufacturing}
                    />
                  )}

                  {row.responsibleEmployeeFullName && (
                    <Chip
                      size="small"
                      label={row.responsibleEmployeeFullName}
                    />
                  )}

                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ display: "block" }}
                  >
                    {renderDates(row.dateFrom, row.dateTo)}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={columnSx}>
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Handyman color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
            >
              {t("assignments.tools")} ({counts.tools})
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
        </Box>

        {tools.loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={22} />
          </Box>
        ) : counts.tools === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("assignments.emptyTools")}
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {tools.rows.map((row) => (
              <Card
                key={`${row.toolId}-${row.responsibleEmployeeId ?? ""}-${
                  row.dateFrom ?? ""
                }`}
                sx={{ p: 1.5 }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 0.25 }}
                  noWrap
                >
                  {row.name || row.inventoryNumber || "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.25 }}
                  noWrap
                >
                  {[row.model, row.serialNumber].filter(Boolean).join(" · ") ||
                    "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                  noWrap
                >
                  {[row.constructionSiteName, row.constructionSiteLocation]
                    .filter(Boolean)
                    .join(" · ") || t("assignments.noSite")}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ flexWrap: "wrap", rowGap: 0.5 }}
                >
                  {row.condition && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={row.condition}
                    />
                  )}

                  {row.responsibleEmployeeFullName && (
                    <Chip
                      size="small"
                      label={row.responsibleEmployeeFullName}
                    />
                  )}

                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ display: "block" }}
                  >
                    {renderDates(row.dateFrom, row.dateTo)}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
