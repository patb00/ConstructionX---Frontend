import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RolesTable from "./RolesTable";
import { PermissionGate } from "../../../../lib/permissions";
import { useTranslation } from "react-i18next";

const RolesListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("roles.list.title")}
        </Typography>

        <PermissionGate guard={{ permission: "Permission.Roles.Create" }}>
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("roles.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <RolesTable />
    </Stack>
  );
};

export default RolesListPage;
