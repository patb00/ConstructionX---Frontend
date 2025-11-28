import * as React from "react";
import { Box, Typography, Card, Chip } from "@mui/material";
import { Construction, DirectionsCar, Handyman } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import type {
  AssignedConstructionSite,
  AssignedTool,
  AssignedVehicle,
} from "../../administration/employees";
import {
  BoardView,
  type BoardColumnConfig,
} from "../../../components/ui/views/BoardView";

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

  const renderDates = (from?: string | null, to?: string | null) => {
    if (!from && !to) return "—";
    if (from && !to) return from;
    if (!from && to) return to;
    if (from === to) return from;
    return `${from} – ${to}`;
  };

  const columns: BoardColumnConfig[] = [
    {
      id: "construction",
      icon: <Construction color="primary" fontSize="small" />,
      title: t("assignments.construction"),
      loading: construction.loading,
      rows: construction.rows,
      emptyLabel: t("assignments.emptyConstruction"),
      renderRow: (row: AssignedConstructionSite) => (
        <Card
          key={`${row.constructionSiteId}-${row.employeeId ?? ""}-${
            row.dateFrom ?? ""
          }`}
          sx={{ p: 1.5 }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }} noWrap>
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
      ),
    },

    // 🔹 Vehicles column
    {
      id: "vehicles",
      icon: <DirectionsCar color="primary" fontSize="small" />,
      title: t("assignments.vehicles"),
      loading: vehicles.loading,
      rows: vehicles.rows,
      emptyLabel: t("assignments.emptyVehicles"),
      renderRow: (row: AssignedVehicle) => (
        <Card
          key={`${row.vehicleId}-${row.responsibleEmployeeId ?? ""}-${
            row.dateFrom ?? ""
          }`}
          sx={{ p: 1.5 }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }} noWrap>
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

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              alignItems: "center",
            }}
          >
            {row.vehicleType && (
              <Chip size="small" variant="outlined" label={row.vehicleType} />
            )}
            {row.yearOfManufacturing && (
              <Chip
                size="small"
                variant="outlined"
                label={row.yearOfManufacturing}
              />
            )}

            {row.responsibleEmployeeFullName && (
              <Chip size="small" label={row.responsibleEmployeeFullName} />
            )}

            <Typography
              variant="caption"
              color="primary.main"
              sx={{ display: "block" }}
            >
              {renderDates(row.dateFrom, row.dateTo)}
            </Typography>
          </Box>
        </Card>
      ),
    },

    // 🔹 Tools column
    {
      id: "tools",
      icon: <Handyman color="primary" fontSize="small" />,
      title: t("assignments.tools"),
      loading: tools.loading,
      rows: tools.rows,
      emptyLabel: t("assignments.emptyTools"),
      renderRow: (row: AssignedTool) => (
        <Card
          key={`${row.toolId}-${row.responsibleEmployeeId ?? ""}-${
            row.dateFrom ?? ""
          }`}
          sx={{ p: 1.5 }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }} noWrap>
            {row.name || row.inventoryNumber || "—"}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.25 }}
            noWrap
          >
            {[row.model, row.serialNumber].filter(Boolean).join(" · ") || "—"}
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

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              alignItems: "center",
            }}
          >
            {row.condition && (
              <Chip size="small" variant="outlined" label={row.condition} />
            )}

            {row.responsibleEmployeeFullName && (
              <Chip size="small" label={row.responsibleEmployeeFullName} />
            )}

            <Typography
              variant="caption"
              color="primary.main"
              sx={{ display: "block" }}
            >
              {renderDates(row.dateFrom, row.dateTo)}
            </Typography>
          </Box>
        </Card>
      ),
    },
  ];

  return <BoardView columns={columns} />;
};
