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

import { renderIsoDateRange } from "../utils/date";

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

  const columns: BoardColumnConfig[] = [
    {
      id: "construction",
      icon: <Construction color="primary" fontSize="small" />,
      title: t("assignments.construction"),
      loading: construction.loading,
      rows: construction.rows,
      emptyContent: (
        <Typography variant="body2" color="text.secondary">
          {t("assignments.emptyConstruction")}
        </Typography>
      ),
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
            {renderIsoDateRange(row.dateFrom, row.dateTo)}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.25 }}
          >
            {t("assignments.siteRange")}{" "}
            {renderIsoDateRange(row.startDate, row.plannedEndDate)}
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

    {
      id: "vehicles",
      icon: <DirectionsCar color="primary" fontSize="small" />,
      title: t("assignments.vehicles"),
      loading: vehicles.loading,
      rows: vehicles.rows,
      emptyContent: (
        <Typography variant="body2" color="text.secondary">
          {t("assignments.emptyVehicles")}
        </Typography>
      ),
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

            <Typography variant="caption" color="primary.main">
              {renderIsoDateRange(row.dateFrom, row.dateTo)}
            </Typography>
          </Box>
        </Card>
      ),
    },

    {
      id: "tools",
      icon: <Handyman color="primary" fontSize="small" />,
      title: t("assignments.tools"),
      loading: tools.loading,
      rows: tools.rows,
      emptyContent: (
        <Typography variant="body2" color="text.secondary">
          {t("assignments.emptyTools")}
        </Typography>
      ),
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

            <Typography variant="caption" color="primary.main">
              {renderIsoDateRange(row.dateFrom, row.dateTo)}
            </Typography>
          </Box>
        </Card>
      ),
    },
  ];

  return <BoardView columns={columns} />;
};
