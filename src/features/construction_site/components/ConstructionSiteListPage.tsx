import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ConstructionSitesTable from "./ConstructionSitesTable";
import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";
import StatusSelect from "../../../components/ui/select/StatusSelect";
import { useConstructionSiteStatusOptions } from "../../constants/enum/useConstructionSiteStatusOptions";

const ConstructionSitesListPage = () => {
  const { t } = useTranslation();
  const statusOptions = useConstructionSiteStatusOptions();

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

      <Stack direction="row" alignItems="center">
        <StatusSelect
          label={t("constructionSites.status.label")}
          placeholder={t("common.all")}
          options={statusOptions}
        />
      </Stack>

      <ConstructionSitesTable />
    </Stack>
  );
};

export default ConstructionSitesListPage;
