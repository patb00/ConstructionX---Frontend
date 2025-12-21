import { Link as RouterLink } from "react-router-dom";
import { Box, Card, Stack, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getModuleIdFromNavItem } from "../../../app/routes/navigationUtils";
import { reportsCardColumnSx } from "../utils/layout";
import { getReportModules } from "../utils/modules";

const ReportsModulesListPage = () => {
  const { t } = useTranslation();

  const modules = getReportModules();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {t("reports.list.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t("reports.list.subtitle")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "stretch",
          width: "100%",
        }}
      >
        {modules.map((item) => {
          const moduleId = getModuleIdFromNavItem(item);

          return (
            <Box sx={reportsCardColumnSx} key={moduleId}>
              <Card
                component={RouterLink}
                to={`/app/izvjestaji/${moduleId}`}
                elevation={0}
                sx={{
                  p: 2,
                  textDecoration: "none",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
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
                      {item.icon}
                    </Box>

                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {t(item.labelKey)}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Typography variant="body2" color="text.secondary">
                    {t("reports.modules.cta")}
                  </Typography>
                </Stack>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ReportsModulesListPage;
