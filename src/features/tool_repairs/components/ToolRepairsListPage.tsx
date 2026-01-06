import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";

export default function ToolRepairsListPage() {
  return (
    <Box sx={{ p: 2, height: "100%" }}>
      <Stack spacing={1}>
        <Typography variant="h5">
          {t("nav.toolRepairs", { defaultValue: "Tool Repairs" })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("common.comingSoon", {
            defaultValue: "This section is coming soon.",
          })}
        </Typography>
      </Stack>
    </Box>
  );
}
