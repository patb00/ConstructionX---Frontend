import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Stack, Typography, Button, Card, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

import {
  getReportsByModuleId,
  type ReportDefinition,
} from "../config/reports.config";
import type { ModuleId } from "../../../app/routes/navigation";
import { getNavItemByModuleId } from "../../../app/routes/navigationUtils";

import { languageToCulture } from "../utils/culture";
import { reportsCardColumnSx } from "../utils/layout";
import { openReport } from "../utils/openReport";

const ModuleReportsPage = () => {
  const { moduleId } = useParams<{ moduleId: ModuleId }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const navItem = useMemo(
    () => (moduleId ? getNavItemByModuleId(moduleId) : undefined),
    [moduleId]
  );

  const culture = useMemo(
    () => languageToCulture(i18n.language),
    [i18n.language]
  );

  const [openingReportId, setOpeningReportId] = useState<string | null>(null);

  if (!moduleId || !navItem) {
    return (
      <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
        <Typography variant="h6" fontWeight={600}>
          {t("reports.module.notFoundTitle")}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/izvjestaji")}
          sx={{ alignSelf: "flex-start", color: "primary.main" }}
        >
          {t("reports.module.back")}
        </Button>
      </Stack>
    );
  }

  const reports: ReportDefinition[] = getReportsByModuleId(moduleId);

  const handleReportClick = async (reportId: string) => {
    setOpeningReportId(reportId);
    try {
      await openReport(reportId, { culture });
    } catch (error) {
      console.error("Greška pri otvaranju izvještaja", error);
      alert("Greška pri otvaranju izvještaja.");
    } finally {
      setOpeningReportId(null);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              fontSize: 20,
            }}
          >
            {navItem.icon}
          </Box>

          <Typography variant="h5" fontWeight={600}>
            {t(navItem.labelKey)}
          </Typography>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/app/izvjestaji")}
          sx={{ color: "primary.main" }}
        >
          {t("reports.module.back")}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {t("reports.module.description")}
      </Typography>

      {reports.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t("reports.module.noReports")}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            width: "100%",
          }}
        >
          {reports.map((report) => {
            const isOpening = openingReportId === report.id;

            return (
              <Box key={report.id} sx={reportsCardColumnSx}>
                <Card
                  elevation={0}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {t(report.labelKey)}
                      </Typography>

                      {report.descriptionKey && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {t(report.descriptionKey)}
                        </Typography>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleReportClick(report.id)}
                        sx={{ mt: 0.5 }}
                        disabled={isOpening}
                      >
                        {isOpening
                          ? t("reports.module.opening")
                          : t("reports.module.open")}
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}
    </Stack>
  );
};

export default ModuleReportsPage;
