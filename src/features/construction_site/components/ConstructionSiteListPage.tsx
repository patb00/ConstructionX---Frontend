import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ConstructionSitesTable from "./ConstructionSitesTable";
import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";

const ConstructionSitesListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("constructionSites.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.ConstructionSites.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("constructionSites.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <ConstructionSitesTable />
    </Stack>
  );
};

export default ConstructionSitesListPage;
