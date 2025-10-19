import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ToolsTable from "./ToolsTable";
import { useTranslation } from "react-i18next";
import { PermissionGate } from "../../../lib/permissions";

const ToolsListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("tools.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Tools.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("tools.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <ToolsTable />
      </Paper>
    </Stack>
  );
};

export default ToolsListPage;
