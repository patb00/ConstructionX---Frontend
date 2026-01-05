import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { PermissionGate } from "../../../lib/permissions";
import { useTranslation } from "react-i18next";
import CertificationTypesTable from "./CertificationTypesTable";

const CertificationTypesListPage = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600}>
          {t("certificationTypes.list.title")}
        </Typography>

        <PermissionGate
          guard={{ permission: "Permission.CertificationTypes.Create" }}
        >
          <Button
            size="small"
            component={RouterLink}
            to="create"
            variant="contained"
          >
            {t("certificationTypes.create.title")}
          </Button>
        </PermissionGate>
      </Stack>

      <CertificationTypesTable />
    </Stack>
  );
};

export default CertificationTypesListPage;
