// src/features/toolRepairs/pages/ToolRepairsListPage.tsx
import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PermissionGate } from "../../../lib/permissions";
import ToolRepairsTable from "../components/ToolRepairsTable";

export default function ToolRepairsListPage() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("toolRepairs.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Tools.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("toolRepairs.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <ToolRepairsTable />
    </Stack>
  );
}
