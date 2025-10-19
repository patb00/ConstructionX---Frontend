import { Button, Stack, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { PermissionGate } from "../../../lib/permissions";
import ToolCategoriesTable from "./ToolCategoriesTable";

const ToolCategoriesListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("toolCategories.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.ToolCategories.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("toolCategories.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <Paper elevation={0} sx={{ flexGrow: 1, mt: 1, p: 0 }}>
        <ToolCategoriesTable />
      </Paper>
    </Stack>
  );
};

export default ToolCategoriesListPage;
